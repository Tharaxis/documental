/**
 * Checks if two values are truthy.
 * @param value1 The first value.
 * @param value2 The second value.
 * @returns True if both values are truthy, otherwise false.
 */
 export function and(value1?: unknown, value2?: unknown): unknown {
  return value1 && value2;
}
