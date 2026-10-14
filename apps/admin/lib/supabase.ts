import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "@repo/app-config";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getAdminSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseClient;
}
