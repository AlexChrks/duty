import type { Lead } from "@/types";

type ExtraData = Record<string, unknown>;

function extra(lead: Lead): ExtraData {
  if (
    !lead.extra_data ||
    typeof lead.extra_data !== "object" ||
    Array.isArray(lead.extra_data)
  ) {
    return {};
  }
  return lead.extra_data as ExtraData;
}

function line(label: string, value: unknown): string | null {
  if (value == null || value === "") return null;
  return `${label}: ${String(value)}`;
}

// --- Taxi ---

function formatTaxiLead(lead: Lead): string {
  const d = extra(lead);
  return [
    "🚕 <b>Новый заказ такси</b>",
    "",
    line("👤 Клиент", lead.customer_name),
    line("📞 Телефон", lead.customer_phone),
    line("📍 Откуда", d.pickup_address),
    line("📍 Куда", d.dropoff_address),
    line("🕐 Время", d.pickup_time),
    line("👥 Пассажиры", d.num_passengers),
    lead.summary ? `\n💬 ${lead.summary}` : null,
    d.notes ? `📝 ${d.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

// --- Car service ---

function formatCarServiceLead(lead: Lead): string {
  const d = extra(lead);
  return [
    "🔧 <b>Новая заявка — автосервис</b>",
    "",
    line("👤 Клиент", lead.customer_name),
    line("📞 Телефон", lead.customer_phone),
    line("🚗 Автомобиль", d.car_model),
    line("📅 Год", d.car_year),
    line("🛠 Услуга", d.service_type),
    lead.summary ? `\n💬 ${lead.summary}` : null,
    d.notes ? `📝 ${d.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

// --- Generic fallback ---

function formatGenericLead(lead: Lead): string {
  return [
    "📋 <b>Новый лид</b>",
    "",
    line("👤 Клиент", lead.customer_name),
    line("📞 Телефон", lead.customer_phone),
    lead.summary ? `\n💬 ${lead.summary}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

// --- Dispatcher ---

export function formatLeadMessage(lead: Lead, vertical: string): string {
  switch (vertical) {
    case "taxi":
      return formatTaxiLead(lead);
    case "car_service":
      return formatCarServiceLead(lead);
    default:
      return formatGenericLead(lead);
  }
}
