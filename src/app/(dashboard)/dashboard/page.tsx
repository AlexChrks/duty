import { Phone, ClipboardList, Clock, UserRoundCheck } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard/queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentCalls } from "@/components/dashboard/recent-calls";
import { RecentLeads } from "@/components/dashboard/recent-leads";
import { formatDuration } from "@/types/call";

export default async function DashboardPage() {
  const { stats, recentCalls, recentLeads } = await getDashboardData();

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Дашборд</h2>
        <p className="text-muted-foreground">
          Обзор активности вашего AI-телефониста.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Звонки сегодня"
          value={String(stats.callsToday)}
          description="Входящих звонков за сегодня"
          icon={Phone}
        />
        <StatCard
          title="Заявки сегодня"
          value={String(stats.leadsToday)}
          description="Новых заявок за сегодня"
          icon={ClipboardList}
        />
        <StatCard
          title="Средняя длительность"
          value={formatDuration(stats.avgDurationSeconds)}
          description="Средняя длительность звонка"
          icon={Clock}
        />
        <StatCard
          title="Перевод на оператора"
          value={String(stats.humanTransfers)}
          description="Переведено на человека"
          icon={UserRoundCheck}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentCalls calls={recentCalls} />
        <RecentLeads leads={recentLeads} />
      </div>
    </div>
  );
}
