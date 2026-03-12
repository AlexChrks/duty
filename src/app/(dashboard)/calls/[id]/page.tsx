import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import { CallTranscript } from "@/components/calls/call-transcript";
import { CallTimeline } from "@/components/calls/call-timeline";
import { getCallById, getCallEvents, getCallLead } from "@/lib/calls/queries";
import {
  parseCallMetadata,
  formatDuration,
  formatPhone,
} from "@/types/call";

interface CallDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CallDetailPage({ params }: CallDetailPageProps) {
  const { id } = await params;

  const [call, events, lead] = await Promise.all([
    getCallById(id),
    getCallEvents(id),
    getCallLead(id),
  ]);

  if (!call) notFound();

  const meta = parseCallMetadata(call.metadata);
  const extractedFields = {
    ...meta.extracted_fields,
    ...(lead?.extra_data && typeof lead.extra_data === "object" && !Array.isArray(lead.extra_data)
      ? (lead.extra_data as Record<string, string>)
      : {}),
  };
  const hasExtractedFields = Object.keys(extractedFields).length > 0;

  return (
    <div className="grid gap-4">
      {/* Back link + heading */}
      <div className="flex items-center gap-3">
        <Link href="/calls">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {formatPhone(call.caller_phone)}
          </h2>
          <p className="text-muted-foreground">
            {new Date(call.started_at).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <CallStatusBadge status={call.status} />
      </div>

      {/* Metadata cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetaCard label="Длительность" value={formatDuration(call.duration_seconds)} />
        <MetaCard label="Намерение" value={meta.intent ?? "—"} />
        <MetaCard
          label="Уверенность"
          value={meta.confidence != null ? `${Math.round(meta.confidence * 100)}%` : "—"}
        />
        <MetaCard
          label="Передан оператору"
          value={meta.transferred_to_human ? "Да" : "Нет"}
        />
      </div>

      {/* Summary */}
      {call.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Краткое содержание</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{call.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Extracted fields */}
      {hasExtractedFields && (
        <Card>
          <CardHeader>
            <CardTitle>Извлечённые данные</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 sm:grid-cols-2">
              {Object.entries(extractedFields).map(([key, val]) => (
                <div key={key} className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{key}</dt>
                  <dd className="text-sm">{String(val)}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Associated lead link */}
      {lead && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Связанная заявка</CardTitle>
            <Link href={`/leads`}>
              <Badge variant="outline" className="gap-1">
                {lead.customer_name ?? "Заявка"}
                <ExternalLink className="size-3" />
              </Badge>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <span>Телефон: {lead.customer_phone ?? "—"}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Статус: {lead.status}</span>
              {lead.summary && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="line-clamp-1 text-muted-foreground">{lead.summary}</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transcript + Timeline side by side */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <CallTranscript events={events} />
        <CallTimeline events={events} />
      </div>

      {/* Recording link */}
      {call.recording_url && (
        <Card>
          <CardContent className="py-3">
            <a
              href={call.recording_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="size-4" />
              Прослушать запись
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
