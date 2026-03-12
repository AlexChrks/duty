import type { Call, CallEvent, Lead, Json } from "@/types";

/**
 * Typed structure for calls.metadata JSONB.
 * The voice server populates these fields when a call ends.
 */
export interface CallMetadata {
  intent?: string;
  confidence?: number;
  transferred_to_human?: boolean;
  extracted_fields?: Record<string, string>;
  [key: string]: unknown;
}

export interface CallWithLead extends Call {
  leads: Pick<Lead, "id" | "customer_name" | "customer_phone" | "status" | "extra_data">[];
}

export function parseCallMetadata(metadata: Json): CallMetadata {
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    return metadata as unknown as CallMetadata;
  }
  return {};
}

export function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}м ${s}с` : `${s}с`;
}

export function formatPhone(phone: string | null): string {
  return phone ?? "Неизвестный";
}

const statusLabels: Record<string, string> = {
  ringing: "Входящий",
  in_progress: "В процессе",
  completed: "Завершён",
  failed: "Ошибка",
  missed: "Пропущен",
};

export function getStatusLabel(status: string): string {
  return statusLabels[status] ?? status;
}

const eventTypeLabels: Record<string, string> = {
  transcript: "Транскрипт",
  status_change: "Смена статуса",
  action: "Действие",
  error: "Ошибка",
};

export function getEventTypeLabel(eventType: string): string {
  return eventTypeLabels[eventType] ?? eventType;
}

export type { Call, CallEvent };
