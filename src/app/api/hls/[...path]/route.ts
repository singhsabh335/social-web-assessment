import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const joined = path.map((segment) => decodeURIComponent(segment)).join("/");

  if (!joined.startsWith("storage/stream/")) {
    return new Response("Not found", { status: 404 });
  }

  const incoming = new URL(request.url);
  const upstreamPath = /\.[a-z0-9]+$/i.test(joined) ? `/${joined}` : `/${joined}/`;
  const upstream = new URL(`/api/v1${upstreamPath}`, ensureTrailingSlash(env.apiBaseUrl));
  incoming.searchParams.forEach((value, key) => {
    upstream.searchParams.set(key, value);
  });

  const token = incoming.searchParams.get("token");
  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstream, {
      cache: "no-store",
      redirect: "follow",
      headers: {
        Accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    return new Response("The stream host could not be reached.", { status: 502 });
  }

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return new Response("The stream could not be loaded.", { status: upstreamResponse.status || 502 });
  }

  const contentType = upstreamResponse.headers.get("content-type") ?? "application/octet-stream";
  const playlistBase = new URL(upstreamResponse.url || upstream);
  const body = await readUpstream(upstreamResponse, contentType);

  if (body.playlist !== null) {
    return new Response(rewritePlaylist(body.playlist, playlistBase), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(body.stream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}

async function readUpstream(
  response: Response,
  contentType: string,
): Promise<{ playlist: string | null; stream: ReadableStream<Uint8Array> | null }> {
  const reader = response.body?.getReader();
  if (!reader) {
    return { playlist: null, stream: null };
  }

  const first = await reader.read();
  if (first.done || !first.value) {
    return { playlist: null, stream: emptyStream() };
  }

  const preview = new TextDecoder().decode(first.value.subarray(0, 16));
  const isPlaylist = preview.startsWith("#EXTM3U") || /mpegurl|m3u8/i.test(contentType);
  if (!isPlaylist) {
    return { playlist: null, stream: continueStream(first.value, reader) };
  }

  const chunks = [first.value];
  while (true) {
    const next = await reader.read();
    if (next.done) {
      break;
    }
    if (next.value) {
      chunks.push(next.value);
    }
  }

  return { playlist: new TextDecoder().decode(concatBytes(chunks)), stream: null };
}

function rewritePlaylist(playlist: string, playlistUrl: URL): string {
  return playlist
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return line;
      }
      if (trimmed.startsWith("#")) {
        return line.replace(/URI="([^"]+)"/g, (_match, uri: string) => {
          return `URI="${toProxyPath(uri, playlistUrl)}"`;
        });
      }
      return toProxyPath(trimmed, playlistUrl);
    })
    .join("\n");
}

function toProxyPath(uri: string, playlistUrl: URL): string {
  const resolved = new URL(uri, playlistUrl);
  const marker = "/api/v1/";
  const index = resolved.pathname.indexOf(marker);
  if (index === -1) {
    return uri;
  }

  const rest = resolved.pathname.slice(index + marker.length).replace(/^\/+/, "");
  const params = new URLSearchParams();
  const token = playlistUrl.searchParams.get("token") ?? resolved.searchParams.get("token");
  if (token) {
    params.set("token", token);
  }
  resolved.searchParams.forEach((value, key) => {
    if (key !== "token") {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return `/api/hls/${rest}${query ? `?${query}` : ""}`;
}

function continueStream(first: Uint8Array, reader: ReadableStreamDefaultReader<Uint8Array>): ReadableStream<Uint8Array> {
  let started = false;
  return new ReadableStream({
    async pull(controller) {
      if (!started) {
        started = true;
        controller.enqueue(first);
        return;
      }
      const next = await reader.read();
      if (next.done) {
        controller.close();
        return;
      }
      if (next.value) {
        controller.enqueue(next.value);
      }
    },
  });
}

function emptyStream(): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.close();
    },
  });
}

function concatBytes(chunks: Uint8Array[]): Uint8Array {
  const size = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const combined = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }
  return combined;
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}
