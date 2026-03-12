import { createClient } from "@/lib/supabase/server";
import type { Call, CallEvent } from "@/types";
import type { CallWithLead } from "@/types/call";

const CALLS_PAGE_SIZE = 50;

export async function getCalls(page = 1): Promise<{
  calls: CallWithLead[];
  hasMore: boolean;
}> {
  const supabase = await createClient();
  const from = (page - 1) * CALLS_PAGE_SIZE;
  const to = from + CALLS_PAGE_SIZE;

  const { data, error } = await supabase
    .from("calls")
    .select("*, leads(id, customer_name, customer_phone, status, extra_data)")
    .order("started_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as CallWithLead[];
  const hasMore = rows.length > CALLS_PAGE_SIZE;

  return {
    calls: hasMore ? rows.slice(0, CALLS_PAGE_SIZE) : rows,
    hasMore,
  };
}

export async function getCallById(id: string): Promise<Call | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("calls")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Call | null;
}

export async function getCallEvents(callId: string): Promise<CallEvent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("call_events")
    .select("*")
    .eq("call_id", callId)
    .order("occurred_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as CallEvent[];
}

export async function getCallLead(callId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("call_id", callId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
