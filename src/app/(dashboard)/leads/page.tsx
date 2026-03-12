import { LeadList } from "@/components/leads/lead-list";

export default function LeadsPage() {
  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
        <p className="text-muted-foreground">
          Incoming leads from your AI phone agent.
        </p>
      </div>
      <LeadList />
    </div>
  );
}
