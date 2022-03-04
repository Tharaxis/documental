/**
 * Sorts an array.
 * @param value The value to sort.
 * @param field The optional field to sort by
 * @returns The sorted array.
 */
export function sortBy(value?: unknown, field?: unknown): ReadonlyArray<string> {
  if (!Array.isArray(value)) return [];
  if (typeof field !== "string") return value.sort();

  return value.sort((a, b) => {
    const fieldA = a[field];
    const fieldB = b[field];
    const valueA = (typeof fieldA === "string") ? fieldA.toUpperCase() : fieldA;
    const valueB = (typeof fieldB === "string") ? fieldB.toUpperCase() : fieldB;
    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  });
}
