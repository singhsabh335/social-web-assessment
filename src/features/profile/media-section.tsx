"use client";

import Link from "next/link";
import { ChevronLeft, Clapperboard, GalleryHorizontalEnd, ImageIcon, Video } from "lucide-react";
import { motion } from "framer-motion";
import { VideoCard } from "@/components/media/video-card";
import { VideoSkeletons } from "@/components/ui/loader";
import { EmptyState, ErrorState } from "@/components/ui/state-message";
import { cardPoster, designImages, streamStamp } from "@/constants/design";
import { homeFeed, reelCaption } from "@/constants/home";
import { profileTabs, type ProfileTab } from "@/constants/profile";
import { useExplore } from "@/hooks/use-explore";
import { videoFiles, watchHref } from "@/lib/media";
import { getTokenProblem } from "@/lib/token";
import { getErrorMessage } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";

const tabIcons = {
  long: ImageIcon,
  short: GalleryHorizontalEnd,
  playlist: Video,
  guestbook: Clapperboard,
} as const;

interface FolderCrumb {
  id: string;
  name: string;
}

interface MediaSectionProps {
  tab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  folder: FolderCrumb;
  canGoBack: boolean;
  onBack: () => void;
  onOpenFolder: (folder: FolderCrumb) => void;
}

export function MediaSection({
  tab,
  onTabChange,
  folder,
  canGoBack,
  onBack,
  onOpenFolder,
}: MediaSectionProps) {
  return (
    <section className="mt-6 px-4 pb-28 sm:px-6 lg:px-8 lg:pb-10" aria-label="Profile media">
      <div role="tablist" aria-label="Video sections" className="grid grid-cols-4 border-b border-white/8">
        {profileTabs.map((item) => {
          const selected = item.id === tab;
          const Icon = tabIcons[item.id];
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`panel-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`relative flex h-12 items-center justify-center text-sm transition-colors ${
                selected ? "font-semibold text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="h-5 w-5 lg:hidden" aria-hidden />
              <span className="hidden lg:inline">{item.label}</span>
              <span className="sr-only lg:hidden">{item.label}</span>
              {selected ? (
                <motion.span
                  layoutId="profile-tab"
                  className="absolute inset-x-6 -bottom-px h-[2px] rounded-full bg-primary"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="pt-4">
        {canGoBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-1 text-sm text-zinc-300 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {folder.name}
          </button>
        ) : null}
        {tab === "guestbook" ? (
          <EmptyState
            title="No guestbook entries"
            description="Messages left on this profile will show up here."
          />
        ) : (
          <ResourcePanel
            folderId={folder.id}
            tab={tab}
            onOpenFolder={onOpenFolder}
          />
        )}
      </div>
    </section>
  );
}

function ResourcePanel({
  folderId,
  tab,
  onOpenFolder,
}: {
  folderId: string;
  tab: Exclude<ProfileTab, "guestbook">;
  onOpenFolder: (folder: FolderCrumb) => void;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const tokenProblem = getTokenProblem(accessToken);
  const query = useExplore(folderId);

  if (tokenProblem) {
    return <ErrorState title="Access token required" description={tokenProblem.message} />;
  }

  if (query.isLoading) {
    return <VideoSkeletons />;
  }

  if (query.isError) {
    return (
      <ErrorState
        title="Could not load videos"
        description={getErrorMessage(query.error)}
        onAction={() => {
          void query.refetch();
        }}
      />
    );
  }

  const resources = query.data?.resources ?? [];
  const folders = resources.filter((resource) => resource.kind === "folder");
  const videos = videoFiles(resources);

  if (tab === "playlist") {
    if (folders.length === 0) {
      return (
        <EmptyState
          title="No playlists in this folder"
          description="The Explore API returned no matching items for this folder."
        />
      );
    }

    return (
      <ul className="no-scrollbar flex gap-3 overflow-x-auto lg:grid lg:grid-cols-4 lg:overflow-visible">
        {folders.map((resource) => (
          <li key={resource.id} className="w-[46%] shrink-0 sm:w-[31%] lg:w-auto">
            <button
              type="button"
              className="block w-full text-left"
              onClick={() => onOpenFolder({ id: resource.id, name: resource.name })}
            >
              <VideoCard title={resource.name} thumbnailUrl={designImages.reel} orientation="portrait" icon="folder" />
            </button>
          </li>
        ))}
      </ul>
    );
  }

  if (videos.length === 0) {
    return (
      <EmptyState
        title="No videos in this folder"
        description="The Explore API returned no matching items for this folder."
      />
    );
  }

  const landscape = tab === "long";
  const cards = Array.from({ length: Math.max(8, videos.length) }, (_, index) => videos[index % videos.length]);

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {cards.map((resource, index) => (
        <li key={`${resource.id}-${index}`}>
          <Link href={watchHref(resource)} className="block">
            <VideoCard
              title={homeFeed.cardTitle}
              viewsLabel={landscape ? homeFeed.longViews : homeFeed.reelViews}
              thumbnailUrl={cardPoster(landscape ? "landscape" : "portrait", index)}
              orientation={landscape ? "landscape" : "portrait"}
              caption={landscape ? undefined : reelCaption}
              stamp={landscape && streamStamp(index)}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
