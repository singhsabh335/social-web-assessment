"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/constants/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] flex-col items-center border-r border-white/6 bg-black py-4 lg:flex">
      <Link
        href="/"
        className="mb-8 grid h-10 w-10 place-items-center rounded-[14px] bg-[#3d00ff] text-lg font-bold text-white shadow-[0_8px_20px_rgba(61,0,255,0.35)]"
        aria-label="Streaming home"
      >
        S
      </Link>
      <nav aria-label="Primary" className="flex flex-1 flex-col items-center gap-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = item.href ? pathname === item.href : false;
          const className = `grid h-11 w-11 place-items-center rounded-xl transition-colors hover:bg-white/6 hover:text-white ${
            active ? "text-white" : "text-zinc-500"
          }`;

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} aria-label={item.label} aria-current={active ? "page" : undefined} title={item.label} className={className}>
                <Icon className="h-5 w-5" aria-hidden />
              </Link>
            );
          }

          return (
            <button key={item.id} type="button" aria-label={item.label} title={item.label} className={className}>
              <Icon className="h-5 w-5" aria-hidden />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
