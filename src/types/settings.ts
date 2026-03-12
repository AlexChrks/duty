export interface BusinessSettingsData {
  name: string;
  vertical: string;
  timezone: string;
  phone: string;
  work_hours: string;
  telegram_chat_id: string;
}

export interface AgentSettingsData {
  greeting_message: string;
  language: string;
  voice_id: string;
  fallback_enabled: boolean;
  confirmation_enabled: boolean;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

// --- Option lists for <select> dropdowns ---

export const VERTICALS = [
  { value: "general", label: "Общий" },
  { value: "taxi", label: "Такси" },
  { value: "car_service", label: "Автосервис" },
] as const;

export const TIMEZONES = [
  { value: "Europe/Moscow", label: "Москва (UTC+3)" },
  { value: "Europe/Kaliningrad", label: "Калининград (UTC+2)" },
  { value: "Europe/Samara", label: "Самара (UTC+4)" },
  { value: "Asia/Yekaterinburg", label: "Екатеринбург (UTC+5)" },
  { value: "Asia/Omsk", label: "Омск (UTC+6)" },
  { value: "Asia/Krasnoyarsk", label: "Красноярск (UTC+7)" },
  { value: "Asia/Irkutsk", label: "Иркутск (UTC+8)" },
  { value: "Asia/Yakutsk", label: "Якутск (UTC+9)" },
  { value: "Asia/Vladivostok", label: "Владивосток (UTC+10)" },
  { value: "Asia/Kamchatka", label: "Камчатка (UTC+12)" },
  { value: "UTC", label: "UTC" },
] as const;

export const LANGUAGES = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
  { value: "kk", label: "Қазақша" },
] as const;

export const VOICES = [
  { value: "default", label: "По умолчанию" },
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
] as const;

// --- Validation ---

const VALID_VERTICALS: readonly string[] = VERTICALS.map((v) => v.value);
const VALID_TIMEZONES: readonly string[] = TIMEZONES.map((t) => t.value);
const VALID_LANGUAGES: readonly string[] = LANGUAGES.map((l) => l.value);
const VALID_VOICES: readonly string[] = VOICES.map((v) => v.value);

const PHONE_RE = /^[+\d][\d\s\-().]{5,19}$/;
const TELEGRAM_CHAT_ID_RE = /^-?\d{5,15}$/;

export function validateBusinessSettings(
  data: BusinessSettingsData,
): string | null {
  if (!data.name.trim()) return "Название компании обязательно";
  if (data.name.trim().length > 100) return "Название слишком длинное (макс. 100)";
  if (!VALID_VERTICALS.includes(data.vertical)) return "Некорректный тип бизнеса";
  if (!VALID_TIMEZONES.includes(data.timezone)) return "Некорректный часовой пояс";
  if (data.phone.trim() && !PHONE_RE.test(data.phone.trim())) {
    return "Некорректный номер телефона";
  }
  if (data.work_hours.trim().length > 200) return "Рабочие часы слишком длинные";
  if (data.telegram_chat_id.trim() && !TELEGRAM_CHAT_ID_RE.test(data.telegram_chat_id.trim())) {
    return "Telegram Chat ID должен быть числом (5-15 цифр)";
  }
  return null;
}

export function validateAgentSettings(
  data: AgentSettingsData,
): string | null {
  if (!data.greeting_message.trim()) return "Приветствие обязательно";
  if (data.greeting_message.trim().length > 500) return "Приветствие слишком длинное (макс. 500)";
  if (!VALID_LANGUAGES.includes(data.language)) return "Некорректный язык";
  if (!VALID_VOICES.includes(data.voice_id)) return "Некорректный голос";
  return null;
}
