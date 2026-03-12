import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, ClipboardList, UserCheck, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

const stats: StatCardProps[] = [
  {
    title: "Звонки сегодня",
    value: "—",
    description: "Данные появятся после подключения агента",
    icon: Phone,
  },
  {
    title: "Новые заявки",
    value: "—",
    description: "Заявки от AI-агента за сегодня",
    icon: ClipboardList,
  },
  {
    title: "Обработанные",
    value: "—",
    description: "Заявки в работе или завершённые",
    icon: UserCheck,
  },
  {
    title: "Конверсия",
    value: "—%",
    description: "Процент конвертированных заявок",
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Дашборд</h2>
        <p className="text-muted-foreground">
          Обзор активности вашего AI-телефониста.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последняя активность</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Здесь будет лента последних звонков и заявок. Подключите AI-агента,
            чтобы начать принимать звонки.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
