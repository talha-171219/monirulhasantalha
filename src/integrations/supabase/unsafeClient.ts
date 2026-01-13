// Temporary untyped Supabase client wrapper
// Use this until backend types are synced so TS doesn't block builds
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as typedSupabase } from './client';

// Cast to SupabaseClient<any> to bypass strict table typing
export const supabase = typedSupabase as unknown as SupabaseClient<any>;
export type AnySupabase = SupabaseClient<any>;
export default supabase;
