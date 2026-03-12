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
import { ClipboardList } from "lucide-react";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { formatPhone } from "@/types/call";
import type { LeadWithCall } from "@/lib/leads/queries";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="rounded-full bg-muted p-3">
        <ClipboardList className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">Заявок пока нет</p>
    </div>
  );
}

export function RecentLeads({ leads }: { leads: LeadWithCall[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние заявки</CardTitle>
        {leads.length > 0 && (
          <CardAction>
            <Link
              href="/leads"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Все заявки →
            </Link>
          </CardAction>
        )}
      </CardHeader>

      {leads.length === 0 ? (
        <CardContent>
          <EmptyState />
        </CardContent>
      ) : (
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Статус</TableHead>
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
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
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
