// filepath: app/components/Navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./ui/navigation-menu";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="w-full bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 py-2">
      <h1 className="text-lg font-bold tracking-tight">FE-APPS</h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild active={pathname === "/"}>
              <Link href="/" className={pathname === "/" ? "text-black" : ""}>Characters</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild active={pathname === "/locations-page"}>
              <Link href="/locations-page" className={pathname === "/locations-page" ? "text-black" : ""}>Locations</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
