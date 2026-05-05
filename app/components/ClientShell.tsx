"use client";

import { SideNavProvider } from "@/app/context/SideNavContext";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return <SideNavProvider>{children}</SideNavProvider>;
}
