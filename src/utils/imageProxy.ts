/**
 * Image Proxy Utility to safely load images without CORS/Referrer issues
 */
export function getProxiedImageUrl(originalUrl?: string): string | undefined {
  if (!originalUrl) return undefined;

  // Don't proxy inline data URIs or already-proxied URLs
  if (originalUrl.startsWith('data:') || originalUrl.startsWith('/api/proxy-image')) {
    return originalUrl;
  }

  // Only proxy external http(s) URLs
  if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://')) {
    return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
  }

  return originalUrl;
}
