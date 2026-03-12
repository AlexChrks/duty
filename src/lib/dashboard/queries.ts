import { createClient } from "@/lib/supabase/server";
import { parseCallMetadata } from "@/types/call";
import type { CallWithLead } from "@/types/call";
import type { LeadWithCall } from "@/lib/leads/queries";

export interface DashboardStats {
  callsToday: number;
  leadsToday: number;
  avgDurationSeconds: number | null;
  humanTransfers: number;
}

function getTodayStartUTC(): string {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now.toISOString();
}

export async function getDashboardData() {
  const supabase = await createClient();
  const todayStart = getTodayStartUTC();

  const [callsStatsResult, leadsCountResult, recentCallsResult, recentLeadsResult] =
    await Promise.all([
      supabase
        .from("calls")
        .select("duration_seconds, metadata")
        .gte("started_at", todayStart),

      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart),

      supabase
        .from("calls")
        .select("*, leads(id, customer_name, customer_phone, status, extra_data)")
        .order("started_at", { ascending: false })
        .limit(5),

      supabase
        .from("leads")
        .select("*, calls(id, caller_phone, started_at, status)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  if (callsStatsResult.error) throw new Error(callsStatsResult.error.message);
  if (leadsCountResult.error) throw new Error(leadsCountResult.error.message);
  if (recentCallsResult.error) throw new Error(recentCallsResult.error.message);
  if (recentLeadsResult.error) throw new Error(recentLeadsResult.error.message);

  const todayCalls = callsStatsResult.data ?? [];

  const durations = todayCalls
    .map((c) => c.duration_seconds)
    .filter((d): d is number => d != null && d > 0);

  const avgDurationSeconds =
    durations.length > 0
      ? Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length)
      : null;

  const humanTransfers = todayCalls.filter((c) => {
    const meta = parseCallMetadata(c.metadata);
    return meta.transferred_to_human === true;
  }).length;

  const stats: DashboardStats = {
    callsToday: todayCalls.length,
    leadsToday: leadsCountResult.count ?? 0,
    avgDurationSeconds,
    humanTransfers,
  };

  return {
    stats,
    recentCalls: (recentCallsResult.data ?? []) as unknown as CallWithLead[],
    recentLeads: (recentLeadsResult.data ?? []) as unknown as LeadWithCall[],
  };
}
