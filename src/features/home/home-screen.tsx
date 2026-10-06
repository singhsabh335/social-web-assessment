"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Flame, Heart } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { VideoCard } from "@/components/media/video-card";
import { cardPoster, designImages, streamStamp } from "@/constants/design";
import { homeCategories, homeFeed, reelCaption } from "@/constants/home";
import { StoryRow } from "@/features/profile/story-row";
import { useExplore } from "@/hooks/use-explore";
import { env } from "@/lib/env";
import { videoFiles, watchHref } from "@/lib/media";
import type { StorageResource } from "@/types/storage";

export function HomeScreen() {
  const query = useExplore(env.exploreFolderId);
  const videos = videoFiles(query.data?.resources ?? []);

  return (
    <AppShell>
      <div className="space-y-8 px-4 py-4 sm:px-6 lg:px-8">
        <section aria-labelledby="stories-heading">
          <h2 id="stories-heading" className="text-base font-semibold">
            Stories
          </h2>
          <StoryRow embedded />
        </section>

        <section aria-labelledby="playlists-heading">
          <SectionHeading
            id="playlists-heading"
            icon={<Heart className="h-4 w-4 fill-pink-500 text-pink-500" aria-hidden />}
            title="Playlist & chill"
            action="All playlists"
            href="/profile"
          />
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {homeCategories.map((category, index) => (
              <li key={`${category.title}-${index}`}>
                <article
                  className="relative h-[92px] overflow-hidden rounded-2xl px-4 py-3.5"
                  style={{ background: `linear-gradient(135deg, ${category.from}, ${category.to})` }}
                >
                  <h3 className="text-[15px] font-semibold leading-none">{category.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400">{category.count}</p>
                  <CategoryPhoto art={category.art} />
                </article>
              </li>
            ))}
          </ul>
        </section>

        <FeedSection
          id="reels-heading"
          title={homeFeed.reelsTitle}
          action={homeFeed.reelsAction}
          videos={videos}
          count={homeFeed.reelsCount}
          fallbackViews={homeFeed.reelViews}
          orientation="portrait"
          caption={reelCaption}
        />

        <FeedSection
          id="long-heading"
          title={homeFeed.longTitle}
          action={homeFeed.longAction}
          videos={videos}
          count={homeFeed.longCount}
          fallbackViews={homeFeed.longViews}
          orientation="landscape"
        />
      </div>
    </AppShell>
  );
}

function FeedSection({
  id,
  title,
  action,
  videos,
  count,
  fallbackViews,
  orientation,
  caption,
}: {
  id: string;
  title: string;
  action: string;
  videos: StorageResource[];
  count: number;
  fallbackViews: string;
  orientation: "portrait" | "landscape";
  caption?: string;
}) {
  const items = Array.from({ length: count }, (_, index) =>
    videos.length > 0 ? videos[index % videos.length] : null,
  );

  return (
    <section aria-labelledby={id}>
      <SectionHeading
        id={id}
        icon={<Flame className="h-4 w-4 fill-orange-500 text-orange-500" aria-hidden />}
        title={title}
        action={action}
        href="/profile"
      />
      <ul
        className={
          orientation === "portrait"
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5"
            : "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5"
        }
      >
        {items.map((resource, index) => {
          const card = (
            <VideoCard
              title={homeFeed.cardTitle}
              viewsLabel={fallbackViews}
              thumbnailUrl={cardPoster(orientation, index)}
              orientation={orientation}
              caption={caption}
              stamp={orientation === "landscape" && streamStamp(index)}
            />
          );

          return (
            <li key={`${resource?.id ?? "design"}-${index}`}>
              {resource ? (
                <Link href={watchHref(resource)} className="block">
                  {card}
                </Link>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SectionHeading({
  id,
  icon,
  title,
  action,
  href,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  action: string;
  href: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 id={id} className="flex items-center gap-2 text-[15px] font-semibold">
        {icon}
        {title}
      </h2>
      <Link href={href} className="shrink-0 text-sm text-zinc-400 transition-colors hover:text-white">
        {action}
      </Link>
    </div>
  );
}

function CategoryPhoto({ art }: { art: keyof typeof designImages.categories }) {
  const src = designImages.categories[art];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="absolute -right-1 top-2.5 h-[76px] w-[68px] rotate-[10deg] rounded-xl object-cover shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
    />
  );
}
