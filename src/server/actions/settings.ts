"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  BusinessSettingsData,
  AgentSettingsData,
  ActionResult,
} from "@/types/settings";
import {
  validateBusinessSettings,
  validateAgentSettings,
} from "@/types/settings";

async function getAuthBusinessId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();

  return profile?.business_id ?? null;
}

// -------------------------------------------------------------------
// Write — update business settings + telegram integration
// -------------------------------------------------------------------

export async function updateBusinessSettings(
  data: BusinessSettingsData,
): Promise<ActionResult> {
  const error = validateBusinessSettings(data);
  if (error) return { success: false, error };

  const businessId = await getAuthBusinessId();
  if (!businessId) return { success: false, error: "Профиль не найден" };

  const admin = createAdminClient();

  const { data: currentBiz } = await admin
    .from("businesses")
    .select("settings")
    .eq("id", businessId)
    .single();

  const existingSettings =
    currentBiz?.settings && typeof currentBiz.settings === "object"
      ? (currentBiz.settings as Record<string, unknown>)
      : {};

  const { error: bizError } = await admin
    .from("businesses")
    .update({
      name: data.name.trim(),
      vertical: data.vertical,
      timezone: data.timezone,
      phone: data.phone.trim() || null,
      settings: { ...existingSettings, work_hours: data.work_hours.trim() },
    })
    .eq("id", businessId);

  if (bizError) return { success: false, error: bizError.message };

  const chatId = data.telegram_chat_id.trim();
  if (chatId) {
    const { error: tgError } = await admin.from("integrations").upsert(
      {
        business_id: businessId,
        type: "telegram",
        is_active: true,
        config: { chat_id: chatId },
      },
      { onConflict: "business_id,type" },
    );
    if (tgError) return { success: false, error: tgError.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

// -------------------------------------------------------------------
// Write — update agent settings (creates config if none exists)
// -------------------------------------------------------------------

const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful AI phone agent for a small business. " +
  "Answer customer questions, collect their information, and create leads.";

export async function updateAgentSettings(
  data: AgentSettingsData,
): Promise<ActionResult> {
  const error = validateAgentSettings(data);
  if (error) return { success: false, error };

  const businessId = await getAuthBusinessId();
  if (!businessId) return { success: false, error: "Профиль не найден" };

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("agent_configs")
    .select("id, config")
    .eq("business_id", businessId)
    .eq("is_active", true)
    .maybeSingle();

  const existingConfig =
    existing?.config && typeof existing.config === "object"
      ? (existing.config as Record<string, unknown>)
      : {};

  const agentFields = {
    greeting_message: data.greeting_message.trim(),
    language: data.language,
    voice_id: data.voice_id,
    config: {
      ...existingConfig,
      fallback_enabled: data.fallback_enabled,
      confirmation_enabled: data.confirmation_enabled,
    },
  };

  if (existing) {
    const { error: updErr } = await admin
      .from("agent_configs")
      .update(agentFields)
      .eq("id", existing.id);

    if (updErr) return { success: false, error: updErr.message };
  } else {
    const { error: insErr } = await admin.from("agent_configs").insert({
      business_id: businessId,
      system_prompt: DEFAULT_SYSTEM_PROMPT,
      ...agentFields,
    });

    if (insErr) return { success: false, error: insErr.message };
  }

  revalidatePath("/settings");
  return { success: true };
}
