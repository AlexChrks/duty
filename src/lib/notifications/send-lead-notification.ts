import { createAdminClient } from "@/lib/supabase/admin";
import type { Lead } from "@/types";
import { sendTelegramMessage } from "./telegram";
import { formatLeadMessage } from "./format-lead";
import { isTelegramConfig, type NotificationResult } from "./types";

/**
 * Looks up active integrations for the lead's business,
 * sends notifications through each, and logs every attempt.
 *
 * Safe to call from any server context — uses admin client
 * to bypass RLS, never throws, and handles its own errors.
 */
export async function sendLeadNotifications(
  lead: Lead,
): Promise<NotificationResult[]> {
  const results: NotificationResult[] = [];

  try {
    const admin = createAdminClient();

    const { data: business } = await admin
      .from("businesses")
      .select("vertical")
      .eq("id", lead.business_id)
      .single();

    const vertical = business?.vertical ?? "general";

    const { data: integrations } = await admin
      .from("integrations")
      .select("id, type, config")
      .eq("business_id", lead.business_id)
      .eq("is_active", true);

    if (!integrations?.length) return results;

    for (const integration of integrations) {
      let result: NotificationResult;

      switch (integration.type) {
        case "telegram": {
          if (!isTelegramConfig(integration.config)) {
            result = {
              provider: "telegram",
              success: false,
              error: "Invalid config: missing chat_id",
            };
            break;
          }

          const text = formatLeadMessage(lead, vertical);
          result = await sendTelegramMessage({
            chatId: integration.config.chat_id,
            text,
          });
          break;
        }

        default:
          continue;
      }

      results.push(result);

      try {
        await admin.from("notification_log").insert({
          business_id: lead.business_id,
          lead_id: lead.id,
          provider: result.provider,
          status: result.success ? "success" : "failed",
          destination:
            integration.type === "telegram"
              ? (integration.config as { chat_id?: string })?.chat_id ?? null
              : null,
          error: result.error ?? null,
        });
      } catch (logErr) {
        console.error("Failed to write notification_log:", logErr);
      }
    }
  } catch (err) {
    console.error("sendLeadNotifications failed:", err);
    results.push({
      provider: "unknown",
      success: false,
      error: "Notification dispatch failed",
    });
  }

  return results;
}
