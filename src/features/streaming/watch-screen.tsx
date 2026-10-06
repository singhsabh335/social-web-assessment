"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Loader } from "@/components/ui/loader";
import { ErrorState } from "@/components/ui/state-message";
import { getTokenProblem } from "@/lib/token";
import { buildStreamUrl } from "@/services/storage.service";
import { useAuthStore } from "@/store/auth.store";
import { VideoPlayer } from "@/features/streaming/video-player";
import type { PlaybackKind } from "@/lib/media";

interface WatchScreenProps {
  fileId: string;
  name?: string;
  kind?: PlaybackKind;
}

export function WatchScreen({ fileId, name, kind = "video" }: WatchScreenProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const tokenProblem = getTokenProblem(accessToken);
  const title = name?.trim() || (kind === "image" ? "Image" : "Video");

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6">
        <Link href="/" className="inline-flex w-fit items-center gap-1 text-sm text-zinc-300 hover:text-white">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back
        </Link>
        <h1 className="text-xl font-semibold">{title}</h1>
        {accessToken && !tokenProblem ? (
          <StreamPreview src={buildStreamUrl(fileId, accessToken)} title={title} />
        ) : (
          <ErrorState title="Access token required" description={tokenProblem?.message} />
        )}
      </div>
    </AppShell>
  );
}

type PreviewState =
  | { status: "loading" }
  | { status: "image" }
  | { status: "video" }
  | { status: "wait"; message: string }
  | { status: "error"; message: string };

function StreamPreview({ src, title }: { src: string; title: string }) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<PreviewState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(src);
        const type = response.headers.get("content-type") ?? "";
        if (type.includes("json")) {
          const data = (await response.json()) as { error?: unknown; details?: unknown };
          const message =
            typeof data.details === "string"
              ? data.details
              : typeof data.error === "string"
                ? data.error
                : "This file is not ready to open.";
          if (!cancelled) {
            setState(data.error === "Processing" ? { status: "wait", message } : { status: "error", message });
          }
          return;
        }
        await response.body?.cancel();
        if (!cancelled) {
          setState({ status: type.startsWith("image/") ? "image" : "video" });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error", message: "The stream host could not be reached." });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src, attempt]);

  useEffect(() => {
    if (state.status !== "wait") {
      return;
    }
    const timer = window.setTimeout(() => setAttempt((value) => value + 1), 8000);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state.status === "loading") {
    return <Loader label="Opening file" />;
  }

  if (state.status === "wait") {
    return (
      <ErrorState
        title="File is still processing"
        description={state.message}
        actionLabel="Retry now"
        onAction={() => setAttempt((value) => value + 1)}
      />
    );
  }

  if (state.status === "error") {
    return <ErrorState title="Could not open this file" description={state.message} />;
  }

  if (state.status === "image") {
    return (
      <div className="overflow-hidden rounded-2xl bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={title} className="max-h-[75vh] w-full object-contain" />
      </div>
    );
  }

  return <VideoPlayer src={src} title={title} />;
}
