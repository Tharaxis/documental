import { TypeInfoBase } from "./TypeInfoBase";
import { FieldInfo } from "./FieldInfo";

/**
 * The function type.
 */
export interface FunctionType extends TypeInfoBase<"function"> {

  /**
   * The description of the return value.
   */
  readonly returnDescription?: string;

  /**
   * The return types.
   */
  readonly returnTypes?: ReadonlyArray<string>;

  /**
   * The function parameters.
   */
  readonly parameters: ReadonlyArray<FieldInfo>;
}
