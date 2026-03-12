"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav, navItems } from "@/components/layout/sidebar";

function usePageTitle(): string {
  const pathname = usePathname();
  return (
    navItems.find((item) => item.href === pathname)?.label ??
    navItems.find((item) => pathname.startsWith(item.href + "/"))?.label ??
    "Duty"
  );
}

export function Header() {
  const router = useRouter();
  const pageTitle = usePageTitle();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-5" />
          <span className="sr-only">Меню</span>
        </Button>

        <h1 className="text-lg font-semibold">{pageTitle}</h1>

        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Навигация</SheetTitle>
          <div className="flex h-14 items-center border-b px-4">
            <span className="text-lg font-semibold">Duty</span>
          </div>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
