import { getCalls } from "@/lib/calls/queries";
import { CallsTable } from "@/components/calls/calls-table";

export default async function CallsPage() {
  const { calls } = await getCalls();

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Звонки</h2>
        <p className="text-muted-foreground">
          История входящих звонков, обработанных AI-агентом.
        </p>
      </div>
      <CallsTable calls={calls} />
    </div>
  );
}
