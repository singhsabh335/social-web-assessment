export interface TokenProblem {
  message: string;
}

export function normalizeAccessToken(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const token = value.replace(/\s+/g, "");
  return token.length > 0 ? token : null;
}

export function getTokenProblem(token: string | null): TokenProblem | null {
  if (!token) {
    return {
      message: "Set NEXT_PUBLIC_ACCESS_TOKEN in .env on a single line, then restart the dev server.",
    };
  }

  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    return {
      message: "The access token is incomplete. Keep the full JWT on one line in .env and restart the dev server.",
    };
  }

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { exp?: unknown };
    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      const when = new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(payload.exp * 1000));
      return {
        message: `This access token expired on ${when}. Paste a new token on one line in .env and restart the dev server.`,
      };
    }
  } catch {
    return {
      message: "The access token could not be read. Paste a new JWT on one line in .env.",
    };
  }

  return null;
}

function decodeBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  return atob(padded);
}
