"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

export default function SidebarNavigation() {
  const pathname = usePathname();
  return (
    <SidebarContent className="p-4 flex flex-col h-full">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Rick And Morty</h1>
        <div className="border-b-4 border-black w-32" />
      </div>
      {/* Menu */}
      <SidebarMenu className="flex flex-col gap-2">
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === "/"} className="flex items-center gap-3 text-lg py-3 px-2">
            <Link href="/">
              <span className="text-2xl">👤</span>
              <span>Character</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === "/locations-page" || pathname === "/locations-page"} className="flex items-center gap-3 text-lg py-3 px-2">
            <Link href="/locations-page">
              <span className="text-2xl">📍</span>
              <span>Location</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      {/* Spacer for mobile-first layout */}
      <div className="flex-1" />
    </SidebarContent>
  );
}
