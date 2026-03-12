import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ensureProfile } from "@/lib/auth/ensure-profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureProfile();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
