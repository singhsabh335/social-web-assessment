import { ChartColumn, Clapperboard, Eye, Heart, Share2, type LucideIcon } from "lucide-react";
import { profileContent } from "@/constants/profile";

const icons: Record<string, LucideIcon> = {
  views: ChartColumn,
  likes: Heart,
  visits: Eye,
  shares: Share2,
  videos: Clapperboard,
};

export function AboutPanel() {
  return (
    <section aria-labelledby="about-profile-heading">
      <h2 id="about-profile-heading" className="text-lg font-semibold">
        About Your Profile
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {profileContent.about.map((item) => {
          const Icon = icons[item.icon] ?? ChartColumn;
          return (
            <li key={item.label}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1c1c1c] px-3.5 py-2 text-sm text-zinc-200">
                <Icon className="h-4 w-4 text-zinc-300" aria-hidden />
                <span className="font-semibold text-white">{item.value}</span>
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
      <h2 className="mt-8 text-lg font-semibold">Your videos Categories</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {profileContent.categories.map((category) => (
          <li key={category}>
            <button
              type="button"
              className="rounded-lg bg-[#1a0d36] px-3 py-1.5 text-sm text-zinc-100 transition-colors hover:bg-[#2a1558]"
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
