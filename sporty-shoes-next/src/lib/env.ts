/**
 * Strips leading Byte Order Mark (BOM) characters from a string.
 * BOM (U+FEFF) can be introduced into env vars via vercel CLI sync
 * on Windows, causing URL parsing and other operations to fail.
 */
export function sanitizeEnvVar(value: string | undefined): string | undefined {
  if (!value) return value
  // U+FEFF = the UTF-8 BOM character
  return value.replace(/^\uFEFF+/, '')
}
