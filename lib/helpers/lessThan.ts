/**
 * Tests if one value is less than the other.
 * @param value1 The first value.
 * @param value2 The second value.
 * @returns True if the first value is less than the second.
 */
 export function lessThan(value1?: unknown, value2?: unknown): boolean {
  return (
    (typeof value1 === "string" && typeof value2 === "string") ||
    (typeof value1 === "number" && typeof value2 === "number")
  ) && (
    value1 < value2
  );
}
