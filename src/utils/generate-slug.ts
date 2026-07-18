/**
 * Generates a URL-friendly slug from a string.
 * Example: generateSlug("Premium Cotton Lungi") → "premium-cotton-lungi"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove special characters
    .replace(/[\s_]+/g, '-')    // replace spaces/underscores with hyphens
    .replace(/--+/g, '-')       // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');   // trim leading/trailing hyphens
}
