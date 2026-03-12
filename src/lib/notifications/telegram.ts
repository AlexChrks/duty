import type { NotificationResult } from "./types";

const TELEGRAM_API = "https://api.telegram.org";

interface SendTelegramParams {
  chatId: string;
  text: string;
  parseMode?: "HTML" | "Markdown";
}

export async function sendTelegramMessage({
  chatId,
  text,
  parseMode = "HTML",
}: SendTelegramParams): Promise<NotificationResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.warn("TELEGRAM_BOT_TOKEN is not set — skipping delivery");
    return {
      provider: "telegram",
      success: false,
      error: "TELEGRAM_BOT_TOKEN is not configured",
    };
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Telegram delivery failed [chat_id=${chatId}]:`, body);
      return {
        provider: "telegram",
        success: false,
        error: `HTTP ${res.status}: ${body.slice(0, 200)}`,
      };
    }

    return { provider: "telegram", success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown fetch error";
    console.error(`Telegram delivery error [chat_id=${chatId}]:`, message);
    return { provider: "telegram", success: false, error: message };
  }
}
