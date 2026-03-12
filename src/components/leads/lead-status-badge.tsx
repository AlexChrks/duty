import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types";

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: {
    label: "Новая",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  contacted: {
    label: "Контакт",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  qualified: {
    label: "Квалиф.",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  converted: {
    label: "Конверсия",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  lost: {
    label: "Потеряна",
    className: "bg-muted text-muted-foreground",
  },
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status] ?? { label: status, className: "" };
  return (
    <Badge variant="secondary" className={cn(config.className)}>
      {config.label}
    </Badge>
  );
}
