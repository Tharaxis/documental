import { PropertyInfo } from "./PropertyInfo";

/**
 * Component metadata.
 */
export interface ComponentMetadata {

  /**
   * The component name.
   */
  readonly name: string;

  /**
   * The component description.
   */
  readonly description?: string;

  /**
   * The properties.
   */
  readonly properties?: ReadonlyArray<PropertyInfo>;
}
