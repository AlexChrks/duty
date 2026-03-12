import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles the PKCE auth callback from Supabase.
 *
 * When a user confirms their email, Supabase redirects here with
 * a `code` query param. We exchange that code for a session, which
 * sets the auth cookies, then redirect to the dashboard.
 *
 * This same route also handles password-reset and magic-link flows
 * if you add them later.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
