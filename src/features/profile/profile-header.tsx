"use client";

import {
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  Link2,
  MapPin,
  MoreVertical,
  Share2,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, IconButton } from "@/components/ui/button";
import { designImages } from "@/constants/design";
import { profileContent } from "@/constants/profile";

interface ProfileHeaderProps {
  following: boolean;
  starred: boolean;
  onToggleFollow: () => void;
  onToggleStar: () => void;
}

export function ProfileHeader({
  following,
  starred,
  onToggleFollow,
  onToggleStar,
}: ProfileHeaderProps) {
  return (
    <header>
      <MobileIntro starred={starred} onToggleStar={onToggleStar} />
      <DesktopCover following={following} onToggleFollow={onToggleFollow} />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 hidden lg:block">
          <ProfileMark />
        </div>
        <ProfileDetails />
      </div>
    </header>
  );
}

function MobileIntro({
  starred,
  onToggleStar,
}: {
  starred: boolean;
  onToggleStar: () => void;
}) {
  const router = useRouter();

  return (
    <div className="relative px-4 pb-2 pt-4 lg:hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={designImages.cover} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black" />
      </div>
      <div className="flex items-center justify-between">
        <IconButton label="Go back" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </IconButton>
        <IconButton label="More options">
          <MoreVertical className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <ProfileMark />
        <div className="flex items-center gap-3">
          <IconButton label={starred ? "Unstar profile" : "Star profile"} onClick={onToggleStar}>
            <Star className={starred ? "h-5 w-5 fill-amber-300 text-amber-300" : "h-5 w-5"} />
          </IconButton>
          <IconButton label="Share profile" onClick={() => shareProfile()}>
            <Share2 className="h-5 w-5" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function DesktopCover({
  following,
  onToggleFollow,
}: {
  following: boolean;
  onToggleFollow: () => void;
}) {
  return (
    <div className="relative hidden h-44 overflow-hidden lg:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={designImages.cover} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_70%]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-3">
        <FollowButton following={following} onToggleFollow={onToggleFollow} />
        <Button variant="outline" className="border-white/15 bg-black/55 backdrop-blur-md">
          Message
        </Button>
        <Button variant="outline" className="border-white/15 bg-black/55 backdrop-blur-md">
          Gift
        </Button>
      </div>
    </div>
  );
}

function ProfileDetails() {
  return (
    <div className="pt-3 lg:pt-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-[22px] font-semibold tracking-tight">{profileContent.name}</h1>
          <BadgeCheck className="h-5 w-5 fill-amber-400 text-black" aria-label="Verified" />
        </div>
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <p className="inline-flex items-center rounded-full border border-white/10 bg-[#161616] px-4 py-2 text-sm text-zinc-200">
            {profileContent.desktopStats.map((stat, index) => (
              <span key={stat.label} className="inline-flex items-center">
                {index > 0 ? <span className="mx-3 text-zinc-600">|</span> : null}
                <span className="font-semibold text-white">{stat.value}</span>
                <span className="ml-1.5">{stat.label}</span>
              </span>
            ))}
          </p>
          <IconButton label="Share profile" onClick={() => void shareProfile()} className="h-9 w-9">
            <Share2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
      <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-online">
        <span className="h-2 w-2 rounded-full bg-online" aria-hidden />
        Available Now
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">{profileContent.bio}</p>

      <div className="mt-4 flex flex-col gap-3 lg:mt-3">
        <div className="order-4 flex flex-wrap items-center gap-x-4 gap-y-2 lg:order-1">
          <span className="rounded-full border border-[#7b5cc4] bg-[#1a1033] px-3 py-1 text-sm">
            {profileContent.freePlaylists} Free Playlists
          </span>
          <span className="rounded-full bg-[#243044] px-3 py-1 text-sm text-zinc-100">
            {profileContent.paidPlaylists} Paid Playlists
          </span>
          <span className="hidden items-center gap-1.5 text-sm text-zinc-300 lg:inline-flex">
            <MapPin className="h-4 w-4 text-zinc-400" aria-hidden />
            {profileContent.location}
          </span>
          <span className="hidden items-center gap-1.5 text-sm text-zinc-300 lg:inline-flex">
            <CalendarDays className="h-4 w-4 text-zinc-400" aria-hidden />
            Joined {profileContent.joined}
          </span>
          <a
            href={profileContent.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 text-sm text-link hover:underline lg:inline-flex"
          >
            <Link2 className="h-4 w-4" aria-hidden />
            {profileContent.websiteLabel}
          </a>
        </div>
        <div className="order-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300 lg:hidden">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-zinc-400" aria-hidden />
            {profileContent.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-zinc-400" aria-hidden />
            Joined {profileContent.joined}
          </span>
          <a
            href={profileContent.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-link hover:underline"
          >
            <Link2 className="h-4 w-4" aria-hidden />
            {profileContent.websiteLabel}
          </a>
        </div>
        <div className="order-2 flex flex-wrap gap-2 lg:order-3">
          {profileContent.links.map((link, index) => (
            <a
              key={`${link.href}-${index}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#141414] px-3 py-1 text-sm text-link hover:border-white/20"
            >
              <Link2 className="h-3.5 w-3.5" aria-hidden />
              {link.label}
            </a>
          ))}
        </div>
        <div className="order-3 flex gap-2 overflow-x-auto lg:hidden">
          {profileContent.mobileStats.map((stat) => (
            <span
              key={stat.label}
              className="shrink-0 rounded-full border border-white/10 bg-[#161616] px-3 py-1.5 text-sm"
            >
              <span className="font-semibold">{stat.value}</span> {stat.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MobileActionBar({
  following,
  onToggleFollow,
}: {
  following: boolean;
  onToggleFollow: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/75 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg gap-3">
        <FollowButton following={following} onToggleFollow={onToggleFollow} className="flex-1" />
        <Button variant="outline" className="flex-1">
          Message
        </Button>
        <Button variant="outline" className="flex-1">
          Gift
        </Button>
      </div>
    </div>
  );
}

function FollowButton({
  following,
  onToggleFollow,
  className,
}: {
  following: boolean;
  onToggleFollow: () => void;
  className?: string;
}) {
  return (
    <Button variant={following ? "outline" : "primary"} className={className} onClick={onToggleFollow}>
      {following ? "Following" : "Follow"}
    </Button>
  );
}

function ProfileMark() {
  return (
    <div className="relative h-[92px] w-[92px] overflow-hidden rounded-full border-4 border-black bg-black shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/profile/mark.svg" alt="" className="h-full w-full object-cover" />
    </div>
  );
}

async function shareProfile() {
  const url = window.location.href;
  try {
    if (navigator.share) {
      await navigator.share({ title: profileContent.name, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  } catch {
    // The share sheet was dismissed, or clipboard access is unavailable.
  }
}
