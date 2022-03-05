import { HelperOptions } from "handlebars";

/**
 * Joins values in an array together.
 * @param value The array value to select from.
 * @param separator The separator to join.
 * @returns The joined string.
 */
export function join(value?: unknown, separator?: unknown): string {
  if (typeof value === "string") value = Array.from(value);
  if (!Array.isArray(value)) return "";
  if (typeof separator !== "string") return value.join("");

  return value.join(separator);
}
