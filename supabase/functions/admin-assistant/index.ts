import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify admin role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, action, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get existing projects for context
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, display_order')
      .order('display_order', { ascending: true });

    const projectsList = projects?.map((p, i) => `${i + 1}. ${p.title} (order: ${p.display_order})`).join('\n') || 'No projects';

    const systemPrompt = `You are Talha's personal admin assistant for his portfolio. You help manage projects and blog posts.

LANGUAGE RULES (VERY IMPORTANT):
1. When chatting with Talha, ALWAYS respond in Banglish (Bengali + English mix). Example: "Bhai, ami project ta add kore dilam! Thumbnail generate hocche..."
2. For BLOG POSTS content: Write in Banglish (Bengali + English mix) - casual, friendly tone
3. For APP/PROJECT data (title, description, category): ALWAYS write in ENGLISH only
4. Blog titles can be Banglish but project titles must be English

CONVERSATION RULES (CRITICAL):
1. REMEMBER the conversation context - don't ask the same question again if user already answered!
2. If user says "beginner friendly" after you asked about difficulty level - START WRITING THE BLOG POST immediately
3. When user provides info you asked for, PROCEED with the task - don't ask again
4. Be proactive - if you have enough info, just do it! Don't keep asking questions
5. Example flow:
   - User: "programming niye blog lekho"
   - You ask: "Beginners der jonno naki advance?"
   - User: "beginner friendly"
   - YOU SHOULD: Start writing the beginner-friendly programming blog post IMMEDIATELY, not ask more questions!

CURRENT PROJECTS:
${projectsList}

PROJECT CATEGORIES (IMPORTANT):
There are 3 main project types:
1. Premium Projects - Set premium: true (high-quality, featured apps)
2. Personal Projects - Set category: "Personal" (Talha's own personal apps/tools)
3. Simple Apps - Any other category like "Productivity", "Education", "Gaming", etc.

Available categories: Personal, Productivity, Education, Gaming, Finance, Social, Entertainment, Utility, Islamic, Tools, Communication, Health, Travel, Media, Development

You can help with:
1. Adding new projects - Generate descriptions and thumbnails if not provided
2. Adding blog posts - Help write and format content in Banglish
3. Positioning projects - at top, bottom, or after specific project

When user wants to add a project, extract this info and respond with JSON:
{
  "action": "add_project",
  "data": {
    "title": "Project Name (ENGLISH)",
    "description": "Description in ENGLISH",
    "category": "Personal | Productivity | Education | Gaming | etc.",
    "app_url": "https://...",
    "thumbnail": "generate" or "provided_url",
    "premium": true/false,
    "featured": true/false,
    "position": "top" | "bottom" | "after:ProjectName"
  }
}

For blog posts (content in Banglish) - WRITE FULL CONTENT, minimum 300 words:
{
  "action": "add_blog",
  "data": {
    "title": "Blog Title (can be Banglish)",
    "content": "FULL blog content in Banglish - write at least 300+ words with proper sections, examples, tips etc. Make it engaging and useful!",
    "author": "Talha"
  }
}

For generating thumbnails:
{
  "action": "generate_thumbnail",
  "data": {
    "title": "Project Name",
    "prompt": "Detailed image prompt in ENGLISH for best results"
  }
}

If just chatting, respond in Banglish. If action is needed, include the JSON at the end wrapped in \`\`\`json ... \`\`\`

BE PROACTIVE LIKE A SMART BHAI:
- If user gives enough info, START DOING THE TASK immediately
- Don't keep asking unnecessary questions
- If user answers your question, USE that answer and proceed
- Generate full content, not drafts - make it ready to publish!`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const aiResponse = aiData.choices[0]?.message?.content || "I couldn't process that.";

    // Parse action from response if present
    const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    let parsedAction = null;
    let cleanResponse = aiResponse;

    if (jsonMatch) {
      try {
        parsedAction = JSON.parse(jsonMatch[1]);
        cleanResponse = aiResponse.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      } catch (e) {
        console.error('Failed to parse action JSON:', e);
      }
    }

    return new Response(
      JSON.stringify({ 
        response: cleanResponse,
        action: parsedAction
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in admin-assistant:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
