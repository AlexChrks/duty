import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CallStatus } from "@/types";
import { getStatusLabel } from "@/types/call";

const statusStyles: Record<CallStatus, string> = {
  ringing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  missed: "bg-muted text-muted-foreground",
};

export function CallStatusBadge({ status }: { status: CallStatus }) {
  return (
    <Badge variant="secondary" className={cn(statusStyles[status])}>
      {getStatusLabel(status)}
    </Badge>
  );
}
