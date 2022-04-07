import ts from "typescript";

/**
 * Checks whether the specified type is a valid component type.
 * @param typeChecker The type checker instance.
 * @param type The type to check.
 * @returns True if the type is that of a component, otherwise false.
 */
export function isComponentType(typeChecker: ts.TypeChecker, type: ts.Type): boolean {
  const { symbol: typeSymbol } = type;
  if (!typeSymbol) return false;

  const typeName = typeChecker.getFullyQualifiedName(typeSymbol);

  if (
    typeName === "React.FunctionComponent" ||
    typeName === "React.VoidFunctionComponent" ||
    typeName === "React.ForwardRefExoticComponent"
  )
    return true;

  const callSignatures = type.getCallSignatures();
  if (callSignatures && callSignatures.length > 0) {
    for (const signature of callSignatures) {
      const returnType = signature.getReturnType();
      if (!returnType || !returnType.symbol) continue;

      const name = typeChecker.getFullyQualifiedName(returnType.symbol);
      if (name === "global.JSX.Element") return true;
    }
  }

  return false;
}
