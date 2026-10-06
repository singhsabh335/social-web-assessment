import Link from "next/link";
import { Bell, Plus, Search } from "lucide-react";
import { IconButton } from "@/components/ui/button";
import { designImages } from "@/constants/design";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 hidden h-16 items-center justify-between bg-black/85 px-6 backdrop-blur-md lg:flex">
      <button
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-[#7d52e4]"
      >
        Upload video
        <Plus className="h-4 w-4" aria-hidden />
      </button>
      <div className="flex items-center gap-3">
        <IconButton label="Search" className="border-transparent bg-transparent hover:bg-white/8">
          <Search className="h-5 w-5" />
        </IconButton>
        <IconButton label="Notifications" className="relative border-transparent bg-transparent hover:bg-white/8">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff3b30]" aria-hidden />
        </IconButton>
        <Link href="/profile" className="relative h-9 w-9 overflow-hidden rounded-full bg-zinc-800" aria-label="Your profile">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={designImages.story} alt="" className="h-full w-full object-cover" />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-black bg-online" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
