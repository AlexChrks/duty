import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/server/actions/leads";
import type { LeadInsert } from "@/types";

/**
 * Webhook endpoint for the voice server.
 * The voice server calls this after a call completes to create a lead.
 */
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.VOICE_SERVER_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as LeadInsert;
    const lead = await createLead(body);
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
