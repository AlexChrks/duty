import { getLeads } from "@/lib/leads/queries";
import { LeadsTable } from "@/components/leads/leads-table";

export default async function LeadsPage() {
  const { leads } = await getLeads();

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Заявки</h2>
        <p className="text-muted-foreground">
          Входящие заявки от вашего AI-агента.
        </p>
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}
