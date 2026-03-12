import { createClient } from "@/lib/supabase/server";
import type { Lead, Call } from "@/types";

export interface LeadWithCall extends Lead {
  calls: Pick<Call, "id" | "caller_phone" | "started_at" | "status"> | null;
}

const LEADS_PAGE_SIZE = 50;

export async function getLeads(page = 1): Promise<{
  leads: LeadWithCall[];
  hasMore: boolean;
}> {
  const supabase = await createClient();
  const from = (page - 1) * LEADS_PAGE_SIZE;
  const to = from + LEADS_PAGE_SIZE;

  const { data, error } = await supabase
    .from("leads")
    .select("*, calls(id, caller_phone, started_at, status)")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as LeadWithCall[];
  const hasMore = rows.length > LEADS_PAGE_SIZE;

  return {
    leads: hasMore ? rows.slice(0, LEADS_PAGE_SIZE) : rows,
    hasMore,
  };
}
