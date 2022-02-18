/**
 * Object field information.
 */
export interface FieldInfo {

  /**
   * The field name.
   */
  readonly name: string;

  /**
   * Indicates whether the field is optional or not.
   */
  readonly optional: boolean;

  /**
   * The set of supported field types.
   */
  readonly types: ReadonlyArray<string>;

  /**
   * The field description.
   */
  readonly description?: string;
}
