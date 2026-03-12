import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone } from "lucide-react";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import type { CallWithLead } from "@/types/call";
import { formatDuration, formatPhone } from "@/types/call";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="rounded-full bg-muted p-3">
        <Phone className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">Звонков пока нет</p>
    </div>
  );
}

export function RecentCalls({ calls }: { calls: CallWithLead[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние звонки</CardTitle>
        {calls.length > 0 && (
          <CardAction>
            <Link
              href="/calls"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Все звонки →
            </Link>
          </CardAction>
        )}
      </CardHeader>

      {calls.length === 0 ? (
        <CardContent>
          <EmptyState />
        </CardContent>
      ) : (
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Телефон</TableHead>
                <TableHead>Время</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/calls/${call.id}`}
                      className="hover:underline"
                    >
                      {formatPhone(call.caller_phone)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(call.started_at).toLocaleString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{formatDuration(call.duration_seconds)}</TableCell>
                  <TableCell>
                    <CallStatusBadge status={call.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
}
