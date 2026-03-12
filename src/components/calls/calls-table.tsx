import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, ArrowUpRight, UserRoundCheck } from "lucide-react";
import { CallStatusBadge } from "./call-status-badge";
import type { CallWithLead } from "@/types/call";
import {
  parseCallMetadata,
  formatDuration,
  formatPhone,
} from "@/types/call";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="rounded-full bg-muted p-3">
        <Phone className="size-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Звонков пока нет</p>
        <p className="text-sm text-muted-foreground">
          Звонки появятся здесь, когда AI-агент начнёт принимать вызовы.
        </p>
      </div>
    </div>
  );
}

function ConfidenceIndicator({ value }: { value?: number }) {
  if (value == null) return <span className="text-muted-foreground">—</span>;

  const pct = Math.round(value * 100);
  const color =
    pct >= 80
      ? "text-green-600 dark:text-green-400"
      : pct >= 50
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";

  return <span className={color}>{pct}%</span>;
}

export function CallsTable({ calls }: { calls: CallWithLead[] }) {
  if (calls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Журнал звонков</CardTitle>
          <CardDescription>
            Все входящие звонки с записями и расшифровками.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Журнал звонков</CardTitle>
        <CardDescription>
          {calls.length} звонк{calls.length === 1 ? "" : calls.length < 5 ? "а" : "ов"} всего
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Телефон</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Длительность</TableHead>
              <TableHead>Намерение</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Уверенность</TableHead>
              <TableHead className="text-center">Оператор</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => {
              const meta = parseCallMetadata(call.metadata);
              return (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">
                    {formatPhone(call.caller_phone)}
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
                    {meta.intent ? (
                      <span className="truncate">{meta.intent}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <CallStatusBadge status={call.status} />
                  </TableCell>
                  <TableCell>
                    <ConfidenceIndicator value={meta.confidence} />
                  </TableCell>
                  <TableCell className="text-center">
                    {meta.transferred_to_human ? (
                      <UserRoundCheck className="mx-auto size-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/calls/${call.id}`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
