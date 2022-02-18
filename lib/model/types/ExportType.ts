import { TypeInfoBase } from "./TypeInfoBase";
import { FieldInfo } from "./FieldInfo";

/**
 * The export type.
 */
export interface ExportType extends TypeInfoBase<"export"> {

  /**
   * The export path.
   */
  readonly path: string;
}
