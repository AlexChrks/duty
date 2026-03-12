"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateAgentSettings } from "@/server/actions/settings";
import {
  LANGUAGES,
  VOICES,
  validateAgentSettings,
  type AgentSettingsData,
} from "@/types/settings";

interface Props {
  initialData: AgentSettingsData;
}

export function AgentSettingsForm({ initialData }: Props) {
  const [form, setForm] = useState<AgentSettingsData>(initialData);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof AgentSettingsData>(
    key: K,
    value: AgentSettingsData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const clientError = validateAgentSettings(form);
    if (clientError) {
      toast.error(clientError);
      return;
    }

    startTransition(async () => {
      const result = await updateAgentSettings(form);
      if (result.success) {
        toast.success("Настройки агента сохранены");
      } else {
        toast.error(result.error ?? "Не удалось сохранить");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-агент</CardTitle>
        <CardDescription>
          Настройки голосового агента: приветствие, язык и поведение.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Greeting */}
          <fieldset className="grid gap-1.5">
            <Label htmlFor="agent-greeting">Приветствие</Label>
            <Textarea
              id="agent-greeting"
              value={form.greeting_message}
              onChange={(e) => set("greeting_message", e.target.value)}
              placeholder="Здравствуйте! Чем могу помочь?"
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Первая фраза, которую произносит агент при ответе на звонок
            </p>
          </fieldset>

          {/* Language + Voice */}
          <div className="grid gap-5 sm:grid-cols-2">
            <fieldset className="grid gap-1.5">
              <Label htmlFor="agent-lang">Язык</Label>
              <select
                id="agent-lang"
                value={form.language}
                onChange={(e) => set("language", e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="grid gap-1.5">
              <Label htmlFor="agent-voice">Голос</Label>
              <select
                id="agent-voice"
                value={form.voice_id}
                onChange={(e) => set("voice_id", e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {VOICES.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          {/* Toggles */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div className="grid gap-0.5">
                <Label htmlFor="agent-fallback">
                  Переадресация при сбое
                </Label>
                <p className="text-xs text-muted-foreground">
                  Перенаправлять звонок на резервный номер, если агент не
                  справляется
                </p>
              </div>
              <Switch
                id="agent-fallback"
                checked={form.fallback_enabled}
                onCheckedChange={(val) => set("fallback_enabled", val)}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div className="grid gap-0.5">
                <Label htmlFor="agent-confirm">
                  Подтверждение данных
                </Label>
                <p className="text-xs text-muted-foreground">
                  Агент повторяет собранные данные и просит подтверждение перед
                  созданием заявки
                </p>
              </div>
              <Switch
                id="agent-confirm"
                checked={form.confirmation_enabled}
                onCheckedChange={(val) => set("confirmation_enabled", val)}
              />
            </div>
          </div>

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
