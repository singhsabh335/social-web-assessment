import { WatchScreen } from "@/features/streaming/watch-screen";
import { playbackKind } from "@/lib/media";

interface WatchPageProps {
  params: Promise<{ fileId: string }>;
  searchParams: Promise<{ name?: string | string[]; kind?: string | string[] }>;
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { fileId } = await params;
  const query = await searchParams;
  const rawName = query.name;
  const rawKind = query.kind;
  const name = Array.isArray(rawName) ? rawName[0] : rawName;
  const kindValue = Array.isArray(rawKind) ? rawKind[0] : rawKind;
  const kind = kindValue === "image" || kindValue === "video" ? kindValue : playbackKind(name ?? "");

  return <WatchScreen fileId={fileId} name={name} kind={kind} />;
}
