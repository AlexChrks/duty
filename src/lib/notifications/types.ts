export interface NotificationResult {
  provider: string;
  success: boolean;
  error?: string;
}

export interface TelegramConfig {
  chat_id: string;
}

export function isTelegramConfig(value: unknown): value is TelegramConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    "chat_id" in value &&
    typeof (value as TelegramConfig).chat_id === "string" &&
    (value as TelegramConfig).chat_id.length > 0
  );
}
