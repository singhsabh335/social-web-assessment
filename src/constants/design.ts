export const designImages = {
  cover: "/design/cover.jpg",
  story: "/design/story.jpg",
  reel: "/design/reel.jpg",
  stream: "/design/stream.jpg",
  streamFace: "/design/stream-face.jpg",
  categories: {
    actor: "/design/cat-actor.jpg",
    creator: "/design/cat-creator.jpg",
    comedy: "/design/cat-comedy.jpg",
    "comedy-2": "/design/cat-creator.jpg",
    music: "/design/cat-music.jpg",
    athlete: "/design/cat-actor.jpg",
    reality: "/design/cat-comedy.jpg",
    "reality-2": "/design/cat-music.jpg",
  },
} as const;

export function cardPoster(orientation: "portrait" | "landscape", index: number): string {
  if (orientation === "portrait") {
    return designImages.reel;
  }
  return index % 3 === 2 ? designImages.streamFace : designImages.stream;
}

export function streamStamp(index: number): boolean {
  return index % 4 === 0 || index % 4 === 3;
}
