/**
 * Checks if one of two values are truthy.
 * @param value1 The first value.
 * @param value2 The second value.
 * @returns True if one of two values are truthy, otherwise false.
 */
export function or(value1?: unknown, value2?: unknown): unknown {
  return value1 || value2;
}
