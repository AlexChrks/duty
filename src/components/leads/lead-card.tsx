"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lead } from "@/types";

const statusColors: Record<Lead["status"], string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  converted: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          {lead.caller_name ?? "Unknown Caller"}
        </CardTitle>
        <Badge variant="secondary" className={statusColors[lead.status]}>
          {lead.status}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-1 text-sm text-muted-foreground">
        <p>{lead.caller_phone}</p>
        {lead.summary && <p className="line-clamp-2">{lead.summary}</p>}
        <p className="text-xs">
          {new Date(lead.created_at).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
