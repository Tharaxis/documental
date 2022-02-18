import { TypeInfoBase } from "./TypeInfoBase";
import { FieldInfo } from "./FieldInfo";

/**
 * The interface type.
 */
export interface InterfaceType extends TypeInfoBase<"interface"> {

  /**
   * The interface fields.
   */
  readonly fields?: ReadonlyArray<FieldInfo>;
}
