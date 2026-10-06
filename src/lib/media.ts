import type { StorageResource } from "@/types/storage";

export type PlaybackKind = "image" | "video";

export function videoFiles(resources: StorageResource[]): StorageResource[] {
  return resources.filter(
    (resource) => resource.kind === "file" && playbackKind(resource.name, resource.mimeType) === "video",
  );
}

export function watchHref(file: { id: string; name: string; mimeType?: string }): string {
  const kind = playbackKind(file.name, file.mimeType);
  return `/watch/${file.id}?name=${encodeURIComponent(file.name)}&kind=${kind}`;
}

export function playbackKind(name: string, mimeType?: string): PlaybackKind {
  const mime = mimeType?.toLowerCase() ?? "";
  if (mime.startsWith("image/")) {
    return "image";
  }
  if (mime.startsWith("video/")) {
    return "video";
  }
  if (/\.(jpe?g|png|gif|webp|avif|bmp)$/i.test(name)) {
    return "image";
  }
  return "video";
}
