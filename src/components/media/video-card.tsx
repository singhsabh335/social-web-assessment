import { Circle, Folder } from "lucide-react";

interface VideoCardProps {
  title: string;
  thumbnailUrl: string;
  viewsLabel?: string;
  orientation?: "portrait" | "landscape";
  caption?: string;
  icon?: "circle" | "folder";
  stamp?: boolean;
}

export function VideoCard({
  title,
  thumbnailUrl,
  viewsLabel,
  orientation = "portrait",
  caption,
  icon = "circle",
  stamp = false,
}: VideoCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-xl bg-zinc-900 ${
        orientation === "portrait" ? "aspect-[3/4]" : "aspect-[16/10]"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/85" />
      {viewsLabel ? (
        <p className="absolute left-2.5 top-2.5 text-[11px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {viewsLabel}
        </p>
      ) : null}
      <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-[7px] bg-[#5b2bff] text-[11px] font-bold leading-none text-white shadow-[0_4px_10px_rgba(91,43,255,0.45)]">
        S
      </span>
      {stamp ? (
        <p className="absolute left-3 top-9 text-[15px] font-black uppercase leading-[0.95] tracking-wide text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.85)]">
          Hacked
          <br />
          Streamer
        </p>
      ) : null}
      {caption ? (
        <p className="absolute inset-x-3 bottom-9 line-clamp-2 text-[10px] leading-snug text-white/80">
          {caption}
        </p>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-2.5 pb-2.5 pt-6">
        <h3 className="min-w-0 flex-1 truncate text-[13px] font-medium text-white">{title}</h3>
        {icon === "folder" ? (
          <Folder className="h-3.5 w-3.5 shrink-0 text-white/80" aria-hidden />
        ) : (
          <Circle className="h-3.5 w-3.5 shrink-0 text-white/70" aria-hidden />
        )}
      </div>
    </article>
  );
}
