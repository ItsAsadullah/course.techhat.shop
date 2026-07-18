export type VideoKind = "youtube" | "vimeo" | "direct" | "unknown";

export function getVideoKind(url?: string | null): VideoKind {
  if (!url) return "unknown";

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be" || host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      return "youtube";
    }
    if (host === "vimeo.com" || host.endsWith("player.vimeo.com")) {
      return "vimeo";
    }
    return "direct";
  } catch {
    return "unknown";
  }
}

export function getVideoEmbedUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const embedId =
        parsed.searchParams.get("v") ||
        parsed.pathname.match(/\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1];
      return embedId ? `https://www.youtube.com/embed/${embedId}` : null;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    if (host.endsWith("player.vimeo.com")) return parsed.toString();

    return parsed.toString();
  } catch {
    return null;
  }
}
