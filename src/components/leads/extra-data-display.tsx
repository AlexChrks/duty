import type { Json } from "@/types";

const MAX_VISIBLE_FIELDS = 4;

const FIELD_LABELS: Record<string, string> = {
  pickup_address: "Откуда",
  dropoff_address: "Куда",
  pickup_time: "Время",
  car_model: "Модель",
  car_year: "Год",
  service_type: "Услуга",
  num_passengers: "Пассажиры",
  notes: "Заметки",
  intent: "Намерение",
};

function formatFieldLabel(key: string): string {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ExtraDataDisplay({ data }: { data: Json }) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return <span className="text-muted-foreground">—</span>;
  }

  const entries = Object.entries(data).filter(
    ([, v]) => v != null && v !== "",
  );

  if (entries.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  const visible = entries.slice(0, MAX_VISIBLE_FIELDS);
  const remaining = entries.length - visible.length;

  return (
    <dl className="flex flex-col gap-0.5 text-xs">
      {visible.map(([key, value]) => (
        <div key={key} className="flex gap-1">
          <dt className="shrink-0 text-muted-foreground">
            {formatFieldLabel(key)}:
          </dt>
          <dd className="truncate font-medium">{String(value)}</dd>
        </div>
      ))}
      {remaining > 0 && (
        <span className="text-muted-foreground">+{remaining} ещё</span>
      )}
    </dl>
  );
}
