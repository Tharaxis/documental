/**
 * Tests whether a specified string matches the given string value or expression.
 * @param value The value.
 * @param expression The expresion.
 * @returns True if a valid match.
 */
 export function match(value?: unknown, expression?: unknown): boolean {
  if (typeof value !== "string") return false;
  if (typeof expression !== "string") return false;

  return !!value.match(expression);
}
