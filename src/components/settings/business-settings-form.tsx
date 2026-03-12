"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateBusinessSettings } from "@/server/actions/settings";
import {
  VERTICALS,
  TIMEZONES,
  validateBusinessSettings,
  type BusinessSettingsData,
} from "@/types/settings";

interface Props {
  initialData: BusinessSettingsData;
}

export function BusinessSettingsForm({ initialData }: Props) {
  const [form, setForm] = useState<BusinessSettingsData>(initialData);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof BusinessSettingsData>(
    key: K,
    value: BusinessSettingsData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const clientError = validateBusinessSettings(form);
    if (clientError) {
      toast.error(clientError);
      return;
    }

    startTransition(async () => {
      const result = await updateBusinessSettings(form);
      if (result.success) {
        toast.success("Настройки бизнеса сохранены");
      } else {
        toast.error(result.error ?? "Не удалось сохранить");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Профиль компании</CardTitle>
        <CardDescription>
          Основные данные вашей компании и контактная информация.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Business name */}
          <fieldset className="grid gap-1.5">
            <Label htmlFor="biz-name">Название компании</Label>
            <Input
              id="biz-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="ООО «Ромашка»"
              required
              maxLength={100}
            />
          </fieldset>

          {/* Business type + Timezone — two columns on md+ */}
          <div className="grid gap-5 sm:grid-cols-2">
            <fieldset className="grid gap-1.5">
              <Label htmlFor="biz-vertical">Тип бизнеса</Label>
              <select
                id="biz-vertical"
                value={form.vertical}
                onChange={(e) => set("vertical", e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {VERTICALS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="grid gap-1.5">
              <Label htmlFor="biz-tz">Часовой пояс</Label>
              <select
                id="biz-tz"
                value={form.timezone}
                onChange={(e) => set("timezone", e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          {/* Phone + Work hours */}
          <div className="grid gap-5 sm:grid-cols-2">
            <fieldset className="grid gap-1.5">
              <Label htmlFor="biz-phone">Резервный телефон</Label>
              <Input
                id="biz-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
              <p className="text-xs text-muted-foreground">
                Для переадресации, если агент недоступен
              </p>
            </fieldset>

            <fieldset className="grid gap-1.5">
              <Label htmlFor="biz-hours">Рабочие часы</Label>
              <Input
                id="biz-hours"
                value={form.work_hours}
                onChange={(e) => set("work_hours", e.target.value)}
                placeholder="Пн-Пт 9:00–18:00"
              />
            </fieldset>
          </div>

          {/* Telegram Chat ID */}
          <fieldset className="grid gap-1.5">
            <Label htmlFor="biz-tg">Telegram Chat ID</Label>
            <Input
              id="biz-tg"
              value={form.telegram_chat_id}
              onChange={(e) => set("telegram_chat_id", e.target.value)}
              placeholder="-1001234567890"
            />
            <p className="text-xs text-muted-foreground">
              ID чата или группы для уведомлений о новых заявках
            </p>
          </fieldset>

          <div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение…" : "Сохранить"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
