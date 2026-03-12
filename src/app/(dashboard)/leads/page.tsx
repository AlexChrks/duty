import { LeadList } from "@/components/leads/lead-list";

export default function LeadsPage() {
  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Заявки</h2>
        <p className="text-muted-foreground">
          Входящие заявки от вашего AI-агента.
        </p>
      </div>
      <LeadList />
    </div>
  );
}
