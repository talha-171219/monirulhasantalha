-- Create storage bucket for project assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for project assets
CREATE POLICY "Anyone can view project assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-assets');

CREATE POLICY "Admins can upload project assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-assets' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can update project assets" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'project-assets' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete project assets" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'project-assets' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);