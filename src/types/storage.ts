export type StorageKind = "file" | "folder";

export interface StorageResource {
  id: string;
  name: string;
  kind: StorageKind;
  mimeType?: string;
}

export interface ExploreResult {
  resources: StorageResource[];
}
