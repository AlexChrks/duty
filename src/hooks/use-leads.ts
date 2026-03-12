"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/stores/app-store";
import type { Lead } from "@/types";

export function useLeads(businessId: string | undefined) {
  const { leads, setLeads, addLead, setLoading } = useAppStore();

  useEffect(() => {
    if (!businessId) return;

    const supabase = createClient();
    setLoading(true);

    supabase
      .from("leads")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setLeads(data as Lead[]);
        setLoading(false);
      });

    // Realtime subscription for new leads
    const channel = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads",
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => addLead(payload.new as Lead),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, setLeads, addLead, setLoading]);

  return { leads, isLoading: useAppStore((s) => s.isLoading) };
}
