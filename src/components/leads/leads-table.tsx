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
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ClipboardList, ArrowUpRight } from "lucide-react";
import { LeadStatusBadge } from "./lead-status-badge";
import { ExtraDataDisplay } from "./extra-data-display";
import { formatPhone } from "@/types/call";
import type { LeadWithCall } from "@/lib/leads/queries";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="rounded-full bg-muted p-3">
        <ClipboardList className="size-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Заявок пока нет</p>
        <p className="text-sm text-muted-foreground">
          Заявки появятся здесь, когда AI-агент начнёт принимать звонки.
        </p>
      </div>
    </div>
  );
}

function pluralizeLeads(count: number): string {
  if (count === 1) return "заявка";
  if (count >= 2 && count <= 4) return "заявки";
  return "заявок";
}

export function LeadsTable({ leads }: { leads: LeadWithCall[] }) {
  if (leads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Список заявок</CardTitle>
          <CardDescription>
            Заявки, созданные AI-агентом из телефонных звонков.
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
        <CardTitle>Список заявок</CardTitle>
        <CardDescription>
          {leads.length} {pluralizeLeads(leads.length)} всего
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Запрос</TableHead>
              <TableHead>Доп. данные</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Звонок</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(lead.created_at).toLocaleString("ru-RU", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="font-medium">
                  {lead.customer_name ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>{formatPhone(lead.customer_phone)}</TableCell>
                <TableCell className="max-w-[200px]">
                  {lead.summary ? (
                    <span className="block truncate">{lead.summary}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="max-w-[260px] whitespace-normal">
                  <ExtraDataDisplay data={lead.extra_data} />
                </TableCell>
                <TableCell>
                  <LeadStatusBadge status={lead.status} />
                </TableCell>
                <TableCell>
                  {lead.calls ? (
                    <Link
                      href={`/calls/${lead.calls.id}`}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowUpRight className="size-3.5" />
                      Открыть
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
