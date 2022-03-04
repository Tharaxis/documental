/**
 * Gets the length of the specified array.
 * @param value The value to try get the length for.
 * @returns The number of items in the array.
 */
 export function length(value?: unknown): number {
  if (value === undefined) return 0;
  if (!Array.isArray(value) && typeof value !== "string") return 1;

  return value.length;
}
