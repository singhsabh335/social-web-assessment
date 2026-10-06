import type { ExploreResult, StorageResource } from "@/types/storage";
import { api } from "@/services/api";

const EXPLORE_LIMIT = 30;

export async function exploreStorage(folderId: string): Promise<ExploreResult> {
  const response = await api.get<unknown>("/api/v1/storage/explore/", {
    params: {
      folder_id: folderId,
      limit: EXPLORE_LIMIT,
    },
  });

  return {
    resources: extractResources(response.data)
      .map(normalizeResource)
      .filter((resource): resource is StorageResource => resource !== null),
  };
}

export function buildStreamUrl(fileId: string, token: string): string {
  const params = new URLSearchParams({ token });
  return `/api/hls/storage/stream/${encodeURIComponent(fileId)}/?${params.toString()}`;
}

function extractResources(payload: unknown): unknown[] {
  if (!isRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.resources)) {
    return payload.resources;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (isRecord(payload.data) && Array.isArray(payload.data.resources)) {
    return payload.data.resources;
  }

  return [];
}

function normalizeResource(value: unknown): StorageResource | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value, ["id", "uuid", "file_id", "resource_id"]);
  if (!id) {
    return null;
  }

  const explicitType = readString(value, ["type", "resource_type", "kind", "node_type"])?.toLowerCase();
  const mimeType = readString(value, ["mime_type", "mimetype", "content_type", "mime"]);
  const isFolder =
    value.is_folder === true ||
    value.isFolder === true ||
    (explicitType ? explicitType.includes("folder") || explicitType.includes("directory") : false);

  const name =
    readString(value, ["name", "title", "filename", "file_name", "display_name"]) ??
    (isFolder ? "Folder" : "Video");

  return {
    id,
    name,
    kind: isFolder ? "folder" : "file",
    mimeType,
  };
}

function readString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
