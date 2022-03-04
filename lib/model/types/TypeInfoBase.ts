/**
 * Type information.
 */
export interface TypeInfoBase<T extends string> {

  /**
   * The type ID.
   */
  readonly id: string;

  /**
   * The type.
   */
  readonly type: T;

  /**
   * The actual type.
   */
  readonly actualType: T;

  /**
   * The type name.
   */
  readonly name: string;

  /**
   * The type description.
   */
   readonly description?: string;
}
