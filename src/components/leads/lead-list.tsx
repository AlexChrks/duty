"use client";

import { useLeads } from "@/hooks/use-leads";
import { useAppStore } from "@/stores/app-store";
import { LeadCard } from "./lead-card";

export function LeadList() {
  const business = useAppStore((s) => s.currentBusiness);
  const { leads, isLoading } = useLeads(business?.id);

  if (!business) {
    return (
      <p className="text-muted-foreground">
        No business configured. Go to Settings to set up your business.
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-muted-foreground">Loading leads...</p>;
  }

  if (leads.length === 0) {
    return (
      <p className="text-muted-foreground">
        No leads yet. They will appear here when your AI agent receives calls.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  );
}
