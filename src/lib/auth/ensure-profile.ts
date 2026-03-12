import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Ensures the authenticated user has a profile + business row.
 *
 * The signup trigger (003_signup_trigger.sql) handles this in the
 * normal flow. This function is a fallback for edge cases where
 * the trigger didn't fire (e.g. user created via Supabase dashboard).
 *
 * Call this in the dashboard layout — it runs once per navigation.
 */
export async function ensureProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Use admin client for the check — bypasses RLS so we never get
  // a false negative from policy edge cases.
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("profiles")
    .select("id, business_id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  // Fallback: trigger didn't create the rows — do it via service role
  const businessName =
    user.user_metadata?.business_name || "My Business";

  const { data: business, error: bizError } = await admin
    .from("businesses")
    .insert({ name: businessName })
    .select("id")
    .single();

  if (bizError) {
    throw new Error(`Failed to create business: ${bizError.message}`);
  }

  const { data: profile, error: profError } = await admin
    .from("profiles")
    .insert({
      id: user.id,
      business_id: business.id,
      full_name: user.user_metadata?.full_name || null,
    })
    .select("id, business_id")
    .single();

  if (profError) {
    throw new Error(`Failed to create profile: ${profError.message}`);
  }

  return profile;
}
