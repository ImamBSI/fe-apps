"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function SidebarNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <SidebarContent className="p-4 flex flex-col h-full bg-white">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Rick And Morty</h1>
        <div className="border-b-4 border-black " />
      </div>

      {/* Menu */}
      <SidebarMenu className="flex flex-col gap-2">
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === "/"}>
            <Link href="/" className="flex items-center gap-3 text-lg py-3 px-2">
              <span className="text-2xl">👤</span>
              <span>Character</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === "/locations-page"}>
            <Link
              href="/locations-page"
              className="flex items-center gap-3 text-lg py-3 px-2"
            >
              <span className="text-2xl">📍</span>
              <span>Location</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <div className="flex-1" />
    </SidebarContent>
  );

  return (
    <>
      {/* ✅ MOBILE TRIGGER */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow border"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* ✅ DESKTOP SIDEBAR */}
      <div className="hidden md:block h-full w-64 shrink-0 fixed md:static top-0 left-0 z-40">
        {sidebarContent}
      </div>

      {/* ✅ MOBILE DRAWER */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 h-screen max-h-none">
          {/* Aksesibilitas: SheetTitle tersembunyi */}
          <SheetTitle className="sr-only">Sidebar Navigation</SheetTitle>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}