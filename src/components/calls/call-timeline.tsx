import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageSquare, RefreshCw, Zap, AlertTriangle } from "lucide-react";
import type { CallEvent, CallEventType } from "@/types";
import { getEventTypeLabel } from "@/types/call";
import type { LucideIcon } from "lucide-react";

const eventIcons: Record<CallEventType, LucideIcon> = {
  transcript: MessageSquare,
  status_change: RefreshCw,
  action: Zap,
  error: AlertTriangle,
};

const eventColors: Record<CallEventType, string> = {
  transcript: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  status_change: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  action: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  error: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

function TimelineItem({ event, isLast }: { event: CallEvent; isLast: boolean }) {
  const Icon = eventIcons[event.event_type] ?? Zap;
  const colorClass = eventColors[event.event_type] ?? "bg-muted text-muted-foreground";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", colorClass)}>
          <Icon className="size-3.5" />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>
      <div className={cn("pb-4", isLast && "pb-0")}>
        <p className="text-sm font-medium leading-tight">
          {getEventTypeLabel(event.event_type)}
          {event.speaker && (
            <span className="ml-1 font-normal text-muted-foreground">
              — {event.speaker === "agent" || event.speaker === "ai" ? "AI-агент" : event.speaker}
            </span>
          )}
        </p>
        {event.content && (
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
            {event.content}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(event.occurred_at).toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

export function CallTimeline({ events }: { events: CallEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Хронология событий</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Событий пока нет.
          </p>
        ) : (
          <div className="flex flex-col">
            {events.map((event, i) => (
              <TimelineItem
                key={event.id}
                event={event}
                isLast={i === events.length - 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
