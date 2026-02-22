export function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ');
}

export function isMeaningfulQuery(query: string, minLength = 3): boolean {
  const normalized = normalizeQuery(query).length >= minLength;
  return normalized;
}