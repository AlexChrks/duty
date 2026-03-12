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
        Бизнес не настроен. Перейдите в Настройки, чтобы настроить компанию.
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-muted-foreground">Загрузка заявок...</p>;
  }

  if (leads.length === 0) {
    return (
      <p className="text-muted-foreground">
        Заявок пока нет. Они появятся здесь, когда AI-агент примет звонки.
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
