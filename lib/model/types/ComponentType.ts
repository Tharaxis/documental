import { TypeInfoBase } from "./TypeInfoBase";
import { FieldInfo } from "./FieldInfo";

/**
 * The component type.
 */
export interface ComponentType extends TypeInfoBase<"component"> {

  /**
   * The component properties.
   */
  readonly properties?: ReadonlyArray<FieldInfo>;
}
