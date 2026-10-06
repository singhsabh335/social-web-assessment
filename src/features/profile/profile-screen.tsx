"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { env } from "@/lib/env";
import type { ProfileTab } from "@/constants/profile";
import { AboutPanel } from "@/features/profile/about-panel";
import { MediaSection } from "@/features/profile/media-section";
import { MobileActionBar, ProfileHeader } from "@/features/profile/profile-header";
import { StoryRow } from "@/features/profile/story-row";

interface FolderCrumb {
  id: string;
  name: string;
}

export function ProfileScreen() {
  const [tab, setTab] = useState<ProfileTab>("short");
  const [following, setFollowing] = useState(false);
  const [starred, setStarred] = useState(false);
  const [stack, setStack] = useState<FolderCrumb[]>([
    { id: env.exploreFolderId, name: "Library" },
  ]);

  const folder = stack[stack.length - 1];

  return (
    <AppShell aside={<AboutPanel />}>
      <ProfileHeader
        following={following}
        starred={starred}
        onToggleFollow={() => setFollowing((value) => !value)}
        onToggleStar={() => setStarred((value) => !value)}
      />
      <StoryRow />
      <MediaSection
        tab={tab}
        onTabChange={setTab}
        folder={folder}
        canGoBack={stack.length > 1}
        onBack={() => setStack((current) => current.slice(0, -1))}
        onOpenFolder={(next) => {
          setStack((current) => [...current, next]);
          setTab("short");
        }}
      />
      <div className="hidden px-6 py-8 md:max-lg:block">
        <AboutPanel />
      </div>
      <MobileActionBar following={following} onToggleFollow={() => setFollowing((value) => !value)} />
    </AppShell>
  );
}
