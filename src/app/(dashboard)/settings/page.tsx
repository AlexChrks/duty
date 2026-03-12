import { ensureProfile } from "@/lib/auth/ensure-profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { BusinessSettingsForm } from "@/components/settings/business-settings-form";
import { AgentSettingsForm } from "@/components/settings/agent-settings-form";
import type { Business, AgentConfig, Integration } from "@/types";
import type { BusinessSettingsData, AgentSettingsData } from "@/types/settings";

export default async function SettingsPage() {
  const { business_id: businessId } = await ensureProfile();

  const admin = createAdminClient();

  const [bizResult, agentResult, tgResult] = await Promise.all([
    admin.from("businesses").select("*").eq("id", businessId).single(),
    admin
      .from("agent_configs")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .maybeSingle(),
    admin
      .from("integrations")
      .select("*")
      .eq("business_id", businessId)
      .eq("type", "telegram")
      .maybeSingle(),
  ]);

  const business = bizResult.data as unknown as Business | null;

  if (!business) {
    return (
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Настройки</h2>
        <p className="text-muted-foreground">
          Не удалось загрузить данные бизнеса.
        </p>
      </div>
    );
  }

  const agentConfig = (agentResult.data as unknown as AgentConfig) ?? null;
  const telegramIntegration =
    (tgResult.data as unknown as Integration) ?? null;

  const businessSettings: BusinessSettingsData = {
    name: business.name,
    vertical: business.vertical,
    timezone: business.timezone,
    phone: business.phone ?? "",
    work_hours:
      ((business.settings as Record<string, unknown> | null)
        ?.work_hours as string) ?? "",
    telegram_chat_id:
      ((telegramIntegration?.config as Record<string, unknown> | null)
        ?.chat_id as string) ?? "",
  };

  const agentSettings: AgentSettingsData = {
    greeting_message:
      agentConfig?.greeting_message ?? "Здравствуйте! Чем могу помочь?",
    language: agentConfig?.language ?? "ru",
    voice_id: agentConfig?.voice_id ?? "default",
    fallback_enabled:
      ((agentConfig?.config as Record<string, unknown> | null)
        ?.fallback_enabled as boolean) ?? false,
    confirmation_enabled:
      ((agentConfig?.config as Record<string, unknown> | null)
        ?.confirmation_enabled as boolean) ?? true,
  };

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Настройки</h2>
        <p className="text-muted-foreground">
          Настройте бизнес и AI-агента.
        </p>
      </div>

      <BusinessSettingsForm initialData={businessSettings} />
      <AgentSettingsForm initialData={agentSettings} />
    </div>
  );
}
