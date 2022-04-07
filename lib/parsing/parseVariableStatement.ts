import ts, { isContinueStatement, isParameter } from "typescript";
import { isComponentType } from "./isComponentType";
import { parseDescription } from "./parseDescription";
import { TypeInfo } from "../model";
import { parseFields } from ".";

/**
 * Parses a variable statement.
 * @param typeChecker The type checker instance.
 * @param variableStatement The variable statement to parse.
 * @returns The type information, or null if not able to be parsed.
 */
export function parseVariableStatement(typeChecker: ts.TypeChecker, variableStatement: ts.VariableStatement): TypeInfo | null {
  const { declarationList } = variableStatement;
  const { declarations } = declarationList;
  const [declaration] = declarations;

  const declarationSymbol = typeChecker.getSymbolAtLocation(declaration.name);
  if (!declarationSymbol) return null;

  const { valueDeclaration } = declarationSymbol;
  if (!valueDeclaration) return null;

  const name = declarationSymbol.name;
  const description = parseDescription(typeChecker, declarationSymbol);
  const type = typeChecker.getTypeOfSymbolAtLocation(declarationSymbol, valueDeclaration);

  if (type.isUnion()) return null;

  const componentType = (type.isUnionOrIntersection()) ?
    type.types.find((type) => isComponentType(typeChecker, type)) :
    type;

  if (componentType && isComponentType(typeChecker, componentType)) {
    if (!componentType.symbol) return null;

    let propsType: ts.Type | undefined;
    const typeName = typeChecker.getFullyQualifiedName(componentType.symbol);
    if (typeName === "React.ForwardRefExoticComponent") {
      propsType = componentType.aliasTypeArguments?.[1];
    } else if (typeName === "React.VoidFunctionComponent" || typeName === "React.FunctionComponent") {
      propsType = componentType.aliasTypeArguments?.[0];
    } else {
      const callSignatures = componentType.getCallSignatures();
      if (callSignatures && callSignatures.length > 0) {
        for (const signature of callSignatures) {
          if (!signature.declaration) continue;

          const returnType = signature.getReturnType();
          if (!returnType || !returnType.symbol) continue;

          const name = typeChecker.getFullyQualifiedName(returnType.symbol);
          if (name !== "global.JSX.Element") continue;

          if (signature.parameters.length === 0) continue;

          propsType = typeChecker.getTypeOfSymbolAtLocation(signature.parameters[0], signature.declaration);
        }
      }

      // first parameter type is type.
    }

    const properties = (propsType) ? parseFields(typeChecker, propsType) : [];

    return {
      id: name,
      type: "component",
      actualType: "component",
      name,
      description,
      properties
    }
  }

  return null;
}
