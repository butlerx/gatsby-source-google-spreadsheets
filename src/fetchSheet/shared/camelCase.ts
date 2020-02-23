export function camelCase(str: string): string {
  const input = str.trim();
  if (input.length === 0) return '';
  if (input.length === 1) return input.toLowerCase();
  return (input.charAt(0).toLowerCase() + input.slice(1))
    .replace(/^[_.\- ]+/, '')
    .replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase())
    .replace(/\d+(\w|$)/g, m => m.toUpperCase());
}
