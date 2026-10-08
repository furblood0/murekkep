const rawApiUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export const API_URL = `${rawApiUrl}/`;

export const API_ORIGIN = rawApiUrl.replace(/\/api$/, '');

export function resolveImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  return url;
}
