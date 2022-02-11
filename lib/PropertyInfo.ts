/**
 * Property information.
 */
export interface PropertyInfo {

  /**
   * The property name.
   */
  readonly name: string;

  /**
   * Indicates whether the property is optional or not.
   */
  readonly optional: boolean;

  /**
   * The property types.
   */
  readonly types: ReadonlyArray<string>;

  /**
   * The property description.
   */
  readonly description: string;
}
