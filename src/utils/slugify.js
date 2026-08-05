export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0400-\u04FF]+/g, '-');
}
