import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// ── Load .env.local ──────────────────────────────────────────────
const envPath = resolve(process.cwd(), ".env.local");
for (const line of readFileSync(envPath, "utf-8").split("\n")) {
  const match = line.match(/^\s*([\w]+)\s*=\s*(.+)\s*$/);
  if (match) process.env[match[1]] = match[2];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ── Helpers ──────────────────────────────────────────────────────
function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── Scenario data ────────────────────────────────────────────────
const scenarios: {
  phone: string;
  intent: string;
  confidence: number;
  transferred: boolean;
  status: string;
  duration: number;
  summary: string;
  extractedFields: Record<string, string>;
  transcript: { speaker: string; text: string }[];
}[] = [
  {
    phone: "+7 (916) 234-56-78",
    intent: "Заказ такси",
    confidence: 0.95,
    transferred: false,
    status: "completed",
    duration: 127,
    summary: "Клиент заказал такси от ул. Тверская до аэропорта Шереметьево. Время подачи — 15 минут.",
    extractedFields: { "Откуда": "ул. Тверская, д. 10", "Куда": "Шереметьево, Терминал B", "Время подачи": "15 минут", "Пассажиры": "2" },
    transcript: [
      { speaker: "agent", text: "Здравствуйте! Служба такси «Комфорт». Чем могу помочь?" },
      { speaker: "customer", text: "Добрый день, мне нужно такси от Тверской до Шереметьево." },
      { speaker: "agent", text: "Конечно! Уточните, пожалуйста, точный адрес на Тверской?" },
      { speaker: "customer", text: "Тверская, дом 10." },
      { speaker: "agent", text: "Терминал?" },
      { speaker: "customer", text: "Терминал Б." },
      { speaker: "agent", text: "Принято! Сколько пассажиров?" },
      { speaker: "customer", text: "Двое, с чемоданами." },
      { speaker: "agent", text: "Машина будет через 15 минут. Стоимость поездки — примерно 2500 рублей. Заказ оформлен!" },
      { speaker: "customer", text: "Спасибо!" },
    ],
  },
  {
    phone: "+7 (903) 111-22-33",
    intent: "Запись на ТО",
    confidence: 0.88,
    transferred: false,
    status: "completed",
    duration: 203,
    summary: "Клиент записался на плановое ТО для Toyota Camry на пятницу, 10:00.",
    extractedFields: { "Марка": "Toyota Camry", "Год": "2021", "Услуга": "Плановое ТО", "Дата записи": "Пятница, 10:00" },
    transcript: [
      { speaker: "agent", text: "Автосервис «Мастер». Здравствуйте!" },
      { speaker: "customer", text: "Здравствуйте, хочу записаться на техобслуживание." },
      { speaker: "agent", text: "Какой у вас автомобиль?" },
      { speaker: "customer", text: "Тойота Камри, 2021 год." },
      { speaker: "agent", text: "Какое обслуживание вас интересует — плановое ТО или что-то конкретное?" },
      { speaker: "customer", text: "Плановое ТО, масло поменять, фильтры." },
      { speaker: "agent", text: "Могу предложить пятницу на 10 утра или понедельник на 14:00. Что удобнее?" },
      { speaker: "customer", text: "Пятница, 10 утра." },
      { speaker: "agent", text: "Записал вас на пятницу, 10:00. Адрес: ул. Промышленная, 5. Ждём вас!" },
    ],
  },
  {
    phone: "+7 (926) 777-88-99",
    intent: "Заказ такси",
    confidence: 0.72,
    transferred: true,
    status: "completed",
    duration: 95,
    summary: "Клиент хотел заказать такси для группы из 6 человек. Переведён на оператора для подбора минивэна.",
    extractedFields: { "Откуда": "Красная площадь", "Пассажиры": "6", "Тип авто": "Минивэн" },
    transcript: [
      { speaker: "agent", text: "Здравствуйте! Служба такси. Чем могу помочь?" },
      { speaker: "customer", text: "Нам нужна машина на 6 человек от Красной площади." },
      { speaker: "agent", text: "Для группы из 6 человек потребуется минивэн. Позвольте перевести вас на оператора для уточнения деталей." },
      { speaker: "customer", text: "Хорошо." },
    ],
  },
  {
    phone: "+7 (915) 555-00-11",
    intent: "Узнать стоимость",
    confidence: 0.91,
    transferred: false,
    status: "completed",
    duration: 68,
    summary: "Клиент узнал стоимость поездки из центра до Внуково. Заказ не оформлен.",
    extractedFields: { "Маршрут": "Центр → Внуково", "Ориентировочная цена": "2000 руб." },
    transcript: [
      { speaker: "agent", text: "Добрый день! Такси «Комфорт»." },
      { speaker: "customer", text: "Сколько будет от центра до Внуково?" },
      { speaker: "agent", text: "Ориентировочно 2000 рублей. Зависит от точного адреса подачи и времени суток." },
      { speaker: "customer", text: "Ладно, я подумаю, спасибо." },
      { speaker: "agent", text: "Будем рады помочь! До свидания." },
    ],
  },
  {
    phone: "+7 (977) 321-54-76",
    intent: "Жалоба",
    confidence: 0.83,
    transferred: true,
    status: "completed",
    duration: 156,
    summary: "Клиент жалуется на опоздание водителя на 30 минут. Переведён на старшего оператора.",
    extractedFields: { "Проблема": "Опоздание водителя", "Заказ №": "T-4829", "Время опоздания": "30 мин" },
    transcript: [
      { speaker: "agent", text: "Здравствуйте! Служба такси." },
      { speaker: "customer", text: "Я час назад заказал такси, водитель опоздал на полчаса!" },
      { speaker: "agent", text: "Приношу извинения за неудобства. Подскажите номер вашего заказа?" },
      { speaker: "customer", text: "Заказ T-4829." },
      { speaker: "agent", text: "Вижу ваш заказ. Для решения этого вопроса переведу вас на старшего оператора." },
    ],
  },
  {
    phone: "+7 (905) 888-33-22",
    intent: "Заказ такси",
    confidence: 0.97,
    transferred: false,
    status: "completed",
    duration: 84,
    summary: "Заказ такси от Курского вокзала до Новых Черёмушек. Машина через 7 минут.",
    extractedFields: { "Откуда": "Курский вокзал", "Куда": "Новые Черёмушки", "Время подачи": "7 минут" },
    transcript: [
      { speaker: "agent", text: "Такси «Комфорт», здравствуйте!" },
      { speaker: "customer", text: "Мне нужна машина от Курского вокзала до Новых Черёмушек." },
      { speaker: "agent", text: "Принято! Машина будет через 7 минут у центрального входа. Стоимость около 800 рублей." },
      { speaker: "customer", text: "Отлично, жду." },
    ],
  },
  {
    phone: "+7 (999) 100-20-30",
    intent: "Запись на ремонт",
    confidence: 0.79,
    transferred: false,
    status: "completed",
    duration: 178,
    summary: "Клиент записался на замену тормозных колодок для BMW X5 на среду.",
    extractedFields: { "Марка": "BMW X5", "Год": "2019", "Услуга": "Замена тормозных колодок", "Дата записи": "Среда, 14:00" },
    transcript: [
      { speaker: "agent", text: "Автосервис «Мастер», добрый день!" },
      { speaker: "customer", text: "Здравствуйте, нужно поменять тормозные колодки." },
      { speaker: "agent", text: "Какой автомобиль?" },
      { speaker: "customer", text: "BMW X5, 2019 года." },
      { speaker: "agent", text: "Передние или задние колодки?" },
      { speaker: "customer", text: "Передние скрипят." },
      { speaker: "agent", text: "Могу записать вас на среду в 14:00. Работа займёт около 2 часов." },
      { speaker: "customer", text: "Подходит, записывайте." },
      { speaker: "agent", text: "Готово! Среда, 14:00. Ул. Промышленная, 5. Ждём вас." },
    ],
  },
  {
    phone: "+7 (916) 600-70-80",
    intent: "",
    confidence: 0.0,
    transferred: false,
    status: "missed",
    duration: 0,
    summary: null as unknown as string,
    extractedFields: {},
    transcript: [],
  },
  {
    phone: "+7 (903) 456-78-90",
    intent: "Заказ такси",
    confidence: 0.65,
    transferred: false,
    status: "failed",
    duration: 12,
    summary: "Соединение прервано после начала разговора.",
    extractedFields: {},
    transcript: [
      { speaker: "agent", text: "Здравствуйте! Служба такси." },
      { speaker: "customer", text: "Алло, мне нужно..." },
    ],
  },
  {
    phone: "+7 (925) 222-33-44",
    intent: "Заказ такси",
    confidence: 0.89,
    transferred: false,
    status: "in_progress",
    duration: null as unknown as number,
    summary: null as unknown as string,
    extractedFields: { "Откуда": "Парк Горького" },
    transcript: [
      { speaker: "agent", text: "Здравствуйте! Такси «Комфорт»." },
      { speaker: "customer", text: "Мне нужно такси от Парка Горького." },
      { speaker: "agent", text: "Куда поедете?" },
    ],
  },
];

// ── Main seed logic ──────────────────────────────────────────────
async function seed() {
  // Find the first business
  const { data: business, error: bizErr } = await supabase
    .from("businesses")
    .select("id")
    .limit(1)
    .single();

  if (bizErr || !business) {
    console.error("No business found. Sign up first to create one.", bizErr);
    process.exit(1);
  }

  const businessId = business.id;
  console.log(`Using business: ${businessId}`);

  // Find an agent config if available
  const { data: agentConfig } = await supabase
    .from("agent_configs")
    .select("id")
    .eq("business_id", businessId)
    .limit(1)
    .maybeSingle();

  const agentConfigId = agentConfig?.id ?? null;

  // Clear existing seed data
  await supabase.from("call_events").delete().eq("business_id", businessId);
  await supabase.from("leads").delete().eq("business_id", businessId);
  await supabase.from("calls").delete().eq("business_id", businessId);
  console.log("Cleared existing calls, events, and leads.");

  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    const minutesAgo = (scenarios.length - i) * rand(30, 180);
    const startedAt = ago(minutesAgo);
    const endedAt = s.duration ? ago(minutesAgo - Math.ceil(s.duration / 60)) : null;

    // Insert call
    const { data: call, error: callErr } = await supabase
      .from("calls")
      .insert({
        business_id: businessId,
        agent_config_id: agentConfigId,
        caller_phone: s.phone,
        status: s.status as "completed" | "failed" | "missed" | "in_progress" | "ringing",
        started_at: startedAt,
        ended_at: endedAt,
        duration_seconds: s.duration || null,
        summary: s.summary || null,
        metadata: {
          intent: s.intent || undefined,
          confidence: s.confidence || undefined,
          transferred_to_human: s.transferred || undefined,
          extracted_fields: Object.keys(s.extractedFields).length > 0
            ? s.extractedFields
            : undefined,
        },
      })
      .select("id")
      .single();

    if (callErr || !call) {
      console.error(`Failed to insert call ${i}:`, callErr);
      continue;
    }

    // Insert status_change event at call start
    await supabase.from("call_events").insert({
      call_id: call.id,
      business_id: businessId,
      event_type: "status_change" as const,
      content: `Статус: ${s.status === "missed" ? "пропущен" : "входящий звонок"}`,
      payload: { from: "ringing", to: s.status === "missed" ? "missed" : "in_progress" },
      occurred_at: startedAt,
    });

    // Insert transcript events
    for (let t = 0; t < s.transcript.length; t++) {
      const line = s.transcript[t];
      const eventTime = ago(minutesAgo - t * 0.3);
      await supabase.from("call_events").insert({
        call_id: call.id,
        business_id: businessId,
        event_type: "transcript" as const,
        speaker: line.speaker === "agent" ? "agent" : "customer",
        content: line.text,
        occurred_at: eventTime,
      });
    }

    // Insert transfer action event if transferred
    if (s.transferred) {
      await supabase.from("call_events").insert({
        call_id: call.id,
        business_id: businessId,
        event_type: "action" as const,
        content: "Звонок переведён на оператора",
        payload: { action: "transfer_to_human" },
        occurred_at: ago(minutesAgo - s.transcript.length * 0.3),
      });
    }

    // Insert end status event for completed/failed calls
    if (s.status === "completed" || s.status === "failed") {
      await supabase.from("call_events").insert({
        call_id: call.id,
        business_id: businessId,
        event_type: "status_change" as const,
        content: `Статус: ${s.status === "completed" ? "завершён" : "ошибка"}`,
        payload: { from: "in_progress", to: s.status },
        occurred_at: endedAt ?? ago(minutesAgo - 1),
      });
    }

    // Create a lead for completed taxi/service calls
    if (s.status === "completed" && s.intent && s.intent !== "Жалоба" && s.intent !== "Узнать стоимость") {
      await supabase.from("leads").insert({
        business_id: businessId,
        call_id: call.id,
        status: "new" as const,
        customer_name: null,
        customer_phone: s.phone,
        summary: s.summary,
        source: "voice",
        extra_data: s.extractedFields,
      });
    }

    console.log(`  ✓ Call ${i + 1}/${scenarios.length}: ${s.phone} [${s.status}]`);
  }

  console.log("\nDone! Seeded 10 calls with events and leads.");
}

seed().catch(console.error);
