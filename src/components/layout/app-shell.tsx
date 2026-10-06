import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

interface AppShellProps {
  children: ReactNode;
  aside?: ReactNode;
}

export function AppShell({ children, aside }: AppShellProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      <div className="lg:pl-[72px]">
        <TopBar />
        <div className={aside ? "lg:grid lg:grid-cols-[minmax(0,1fr)_300px]" : undefined}>
          <main className="min-w-0">{children}</main>
          {aside ? (
            <aside className="hidden border-l border-white/6 px-5 py-6 lg:block">{aside}</aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
