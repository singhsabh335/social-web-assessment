import { normalizeAccessToken } from "@/lib/token";

const DOCUMENTED_FOLDER_ID = "bfce46dc-5b98-4a57-8bda-283ef811682b";

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "https://api.hey.watch",
  exploreFolderId:
    process.env.NEXT_PUBLIC_EXPLORE_FOLDER_ID?.trim() || DOCUMENTED_FOLDER_ID,
  accessToken: normalizeAccessToken(process.env.NEXT_PUBLIC_ACCESS_TOKEN),
};
