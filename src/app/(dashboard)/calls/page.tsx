import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone } from "lucide-react";

export default function CallsPage() {
  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Звонки</h2>
        <p className="text-muted-foreground">
          История входящих звонков, обработанных AI-агентом.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Журнал звонков</CardTitle>
          <CardDescription>
            Все входящие звонки с записями и расшифровками.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="rounded-full bg-muted p-3">
              <Phone className="size-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Звонков пока нет</p>
              <p className="text-sm text-muted-foreground">
                Звонки появятся здесь, когда AI-агент начнёт принимать вызовы.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
