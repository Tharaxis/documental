import ts from "typescript";

/**
 * Checks whether the specified type is a valid component type.
 * @param type The type to check.
 * @returns True if the type is that of a component, otherwise false.
 */
export function isComponentType(type: ts.Type): boolean {
  const { symbol: typeSymbol } = type;
  const { name: typeName } = typeSymbol;

  return (typeName === "FunctionComponent" || typeName === "VoidFunctionComponent");
}
