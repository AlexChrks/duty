import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

/**
 * Server-only Supabase client with service_role key.
 * Bypasses RLS — use only in server code for admin operations
 * like creating profiles/businesses during signup.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
