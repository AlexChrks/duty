import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CallEvent } from "@/types";

interface CallTranscriptProps {
  events: CallEvent[];
}

function TranscriptBubble({ event }: { event: CallEvent }) {
  const isAgent = event.speaker === "agent" || event.speaker === "ai";
  const isSystem = !event.speaker || event.speaker === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-muted-foreground italic">
          {event.content}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex", isAgent ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          isAgent
            ? "bg-muted text-foreground"
            : "bg-primary text-primary-foreground",
        )}
      >
        <p className="mb-0.5 text-[10px] font-medium opacity-70">
          {isAgent ? "AI-агент" : "Клиент"}
        </p>
        <p className="whitespace-pre-wrap">{event.content}</p>
      </div>
    </div>
  );
}

export function CallTranscript({ events }: CallTranscriptProps) {
  const transcriptEvents = events.filter((e) => e.event_type === "transcript");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Транскрипт</CardTitle>
      </CardHeader>
      <CardContent>
        {transcriptEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Транскрипт недоступен для этого звонка.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {transcriptEvents.map((event) => (
              <TranscriptBubble key={event.id} event={event} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
