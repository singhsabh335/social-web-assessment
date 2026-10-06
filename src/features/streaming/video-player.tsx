"use client";

import { useEffect, useRef, useState } from "react";
import type Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  title: string;
}

export function VideoPlayer({ src, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reportedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  function reportError(message: string) {
    if (reportedRef.current) {
      return;
    }
    reportedRef.current = true;
    setError(message);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    let hls: Hls | null = null;
    let cancelled = false;
    reportedRef.current = false;
    setError(null);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return () => {
        video.removeAttribute("src");
        video.load();
      };
    }

    void import("hls.js").then(({ default: HlsLib }) => {
      if (cancelled || !videoRef.current) {
        return;
      }

      if (!HlsLib.isSupported()) {
        reportError("This browser cannot play the HLS stream.");
        return;
      }

      const player = new HlsLib({ enableWorker: true });
      hls = player;
      player.loadSource(src);
      player.attachMedia(videoRef.current);
      player.on(HlsLib.Events.MANIFEST_PARSED, () => {
        void videoRef.current?.play().catch(() => undefined);
      });
      player.on(HlsLib.Events.ERROR, (_, data) => {
        if (!data.fatal) {
          return;
        }
        reportError("Playback failed. The stream may be unauthorized or unavailable.");
        player.destroy();
      });
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src]);

  return (
    <div className="overflow-hidden rounded-2xl bg-zinc-950">
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        className="aspect-video w-full bg-black"
        aria-label={title}
        onError={() => reportError("Playback failed. The stream may be unauthorized or unavailable.")}
      />
      {error ? (
        <p role="alert" className="px-4 py-3 text-sm text-zinc-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
