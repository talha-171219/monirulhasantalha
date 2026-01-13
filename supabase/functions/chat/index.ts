import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are Talha's AI assistant on his portfolio website. You help visitors learn about Monirul Hasan Talha, a web developer from Bogura, Bangladesh.

Key Information:
- Name: Monirul Hasan Talha
- Location: Bogura, Bangladesh
- Skills: HTML, CSS, JavaScript, React, Node.js, TypeScript
- Education: BIAM Model School and College, Bogura (Intermediate)
- Contact: monirulhasantalha@gmail.com, Phone: 01909751433
- Social: GitHub (talha-171219), Facebook (talha171219), Telegram (@talha91108)

Projects Categories:
- Web Development (Portfolio, Campus Connect, E-Commerce demos)
- AI/ML (AI Mini Bot, Tabeya AI Companion)
- Education (Study Helper, Online Course Platform, HSC Quiz)
- Communication (Chat Apps, Video/Voice Call apps)
- Productivity (Calendar, Focus Timer, Smartboard)
- Utility (Weather App, QR Generator, Image Converter, Translator)
- Entertainment (Games, Music Player, Media Player)
- Finance (Money Tracker, Personal Finance)
- And many more!

Be helpful, friendly, and concise. If asked about specific projects, mention that visitors can browse all projects on the Projects page. Always encourage them to reach out to Talha for collaborations.`;

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
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
