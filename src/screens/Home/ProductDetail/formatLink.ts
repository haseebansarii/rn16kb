export function formatExternalLink(link?: string): string {
  if (!link || typeof link !== 'string') return '';

  const trimmedLink = link.trim();

  return trimmedLink.startsWith('http://') || trimmedLink.startsWith('https://')
    ? trimmedLink
    : `https://${trimmedLink}`;
}
