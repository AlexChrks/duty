interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: "HTML" | "Markdown";
}

export async function sendTelegramMessage({
  chatId,
  text,
  parseMode = "HTML",
}: TelegramMessage): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("TELEGRAM_BOT_TOKEN not set, skipping notification");
    return false;
  }

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
    },
  );

  if (!res.ok) {
    console.error("Telegram send failed:", await res.text());
    return false;
  }

  return true;
}

export function formatLeadMessage(lead: {
  customer_name: string | null;
  customer_phone: string | null;
  summary: string | null;
}): string {
  const name = lead.customer_name ?? "Неизвестно";
  return [
    `<b>Новый лид</b>`,
    `Имя: ${name}`,
    lead.customer_phone ? `Телефон: ${lead.customer_phone}` : null,
    lead.summary ? `Описание: ${lead.summary}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
