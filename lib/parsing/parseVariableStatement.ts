import ts from "typescript";
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
    type.types.find((type) => isComponentType(type)) :
    type;

  if (componentType && isComponentType(componentType)) {
    const propsType = (componentType.symbol?.name === "ForwardRefExoticComponent") ?
      componentType.aliasTypeArguments?.[1] :
      componentType.aliasTypeArguments?.[0];

    if (componentType.symbol?.name === "ForwardRefExoticComponent") {
      console.log(propsType);
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
