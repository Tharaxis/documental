import { HelperOptions } from "handlebars";

/**
 * Selects values from an array.
 * @param value The array value to select from.
 * @param field The field to select from.
 * @returns The array with the selected values.
 */
export function select(value?: unknown, field?: unknown): ReadonlyArray<unknown> {
  if (!Array.isArray(value)) return [];
  if (typeof field !== "string") return value;

  return value.map((val) => val[field]);
}
