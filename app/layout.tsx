import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  SidebarProvider,
  Sidebar
} from "@/components/ui/sidebar";
import SidebarNavigation from "@/components/sidebar-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Front-end Apps",
  description: "Browse Rick and Morty characters and locations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <div className="w-64 shrink-0">
              <SidebarNavigation />
            </div>
            <div className="flex-1 min-w-0 w-full bg-gray-50">
              {children}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
