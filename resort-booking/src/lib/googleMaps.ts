export function buildGoogleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`;
}

/** Small map preview iframe when admin has not pasted an embed code. */
export function buildGoogleMapsEmbedPreviewUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query.trim())}&output=embed&hl=en&z=15`;
}

function isGoogleMapsLink(value: string): boolean {
  return /google\.(com|[a-z]{2,3})\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(value);
}

/** Accept embed iframe code, embed URL, or Google Maps share link from admin. */
export function parseMapEmbedInput(raw?: string): {
  embedUrl: string | null;
  mapsUrl: string | null;
} {
  const input = raw?.trim() ?? '';
  if (!input) return { embedUrl: null, mapsUrl: null };

  const iframeMatch = input.match(/src=["']([^"']+)["']/i);
  if (iframeMatch?.[1]) {
    const src = iframeMatch[1];
    return {
      embedUrl: src.includes('/maps/embed') ? src : null,
      mapsUrl: isGoogleMapsLink(src) ? src : null,
    };
  }

  if (input.includes('/maps/embed')) {
    return { embedUrl: input, mapsUrl: null };
  }

  if (isGoogleMapsLink(input)) {
    return {
      embedUrl: buildGoogleMapsEmbedPreviewUrl(input),
      mapsUrl: input,
    };
  }

  return { embedUrl: null, mapsUrl: null };
}

export function resolveMapsDisplay(
  mapEmbedUrl: string | undefined,
  address: string,
  location: string,
): { embedUrl: string | null; mapsUrl: string | null; hasMap: boolean } {
  const parsed = parseMapEmbedInput(mapEmbedUrl);
  const query = [address, location].filter(Boolean).join(', ');
  const mapsUrl = parsed.mapsUrl || (query ? buildGoogleMapsSearchUrl(query) : null);
  const embedUrl =
    parsed.embedUrl || (query ? buildGoogleMapsEmbedPreviewUrl(query) : null);

  return {
    embedUrl,
    mapsUrl,
    hasMap: Boolean(embedUrl || mapsUrl),
  };
}
