-- ========================================
-- SECURITY FIX MIGRATION
-- Goal: prevent privilege escalation + lock down storage,
-- WITHOUT breaking existing admin (you) or app functionality.
-- ========================================

-- 1) PRIVILEGE ESCALATION FIX
-- Remove client-side INSERT/UPDATE/DELETE policies on user_roles.
-- Without these policies (and with RLS enabled), the anon/authenticated
-- clients cannot write to user_roles at all.
-- The service_role key (used in edge functions / SQL editor) bypasses RLS,
-- so the owner can still manage roles via SQL or edge functions.

DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;

-- Keep the existing SELECT policy ("Users can view their own roles") intact
-- so the app can still check if the logged-in user is an admin.

-- 2) STORAGE: lock down project-thumbnails write access
-- Public SELECT stays (so thumbnails load on the site).
-- Only admins can insert/update/delete files in this bucket from the client.

-- Public read (idempotent — drop if exists then recreate)
DROP POLICY IF EXISTS "Public read project-thumbnails" ON storage.objects;
CREATE POLICY "Public read project-thumbnails"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-thumbnails');

DROP POLICY IF EXISTS "Admins can upload project-thumbnails" ON storage.objects;
CREATE POLICY "Admins can upload project-thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-thumbnails'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins can update project-thumbnails" ON storage.objects;
CREATE POLICY "Admins can update project-thumbnails"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-thumbnails'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins can delete project-thumbnails" ON storage.objects;
CREATE POLICY "Admins can delete project-thumbnails"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-thumbnails'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- 3) STORAGE: same lock-down for project-assets bucket
DROP POLICY IF EXISTS "Public read project-assets" ON storage.objects;
CREATE POLICY "Public read project-assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-assets');

DROP POLICY IF EXISTS "Admins can upload project-assets" ON storage.objects;
CREATE POLICY "Admins can upload project-assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins can update project-assets" ON storage.objects;
CREATE POLICY "Admins can update project-assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins can delete project-assets" ON storage.objects;
CREATE POLICY "Admins can delete project-assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
