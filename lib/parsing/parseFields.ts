import ts, { nodeModuleNameResolver } from "typescript";
import { parseDescription } from "./parseDescription";
import { FieldInfo } from "../model";

/**
 * Parses the fields from the specified type.
 * @param typeChecker The type checker instance.
 * @param type The type to parse the fields from.
 * @returns The set of fields information.
 */
export function parseFields(typeChecker: ts.TypeChecker, type: ts.Type): ReadonlyArray<FieldInfo> {
  const properties = type.getProperties();
  const result: Array<FieldInfo> = [];

  for (const property of properties) {
    const { valueDeclaration } = property;
    if (!valueDeclaration) continue;
    if (!ts.isPropertySignature(valueDeclaration)) continue;

    const { type } = valueDeclaration;
    if (!type) continue;

    const propertyType = typeChecker.getTypeFromTypeNode(type);
    const name = property.name;
    const description = parseDescription(typeChecker, property);
    const optional = ((property.flags & ts.SymbolFlags.Optional) !== 0);

    let types = [typeChecker.typeToString(propertyType)];

    /*
    let types = (propertyType.isUnion()) ?
      propertyType.types.map((type) => typeChecker.typeToString(type)) :
      [typeChecker.typeToString(propertyType)];
    */

    // replace true/false union with boolean.
    if (types.includes("false") && types.includes("true") && !types.includes("boolean")) {
      types = types.filter((type) => type !== "true");
      types[types.indexOf("false")] = "boolean";
    }

    result.push({ name, description, optional, types });
  }

  return result;
}
