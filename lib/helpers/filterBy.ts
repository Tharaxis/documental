/**
 * Filters not matching teh specified value out of the array.
 * @param array The array to filter.
 * @param value The value to filter out.
 * @returns The filtered array.
 */
 export function filterBy(array?: unknown, value?: unknown): ReadonlyArray<string> {
  if (!Array.isArray(array)) return [];
  return array.filter((val) => val === value);
}
