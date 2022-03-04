import ts from "typescript";
import { parseDescription, parseFields } from ".";
import { TypeInfo } from "../model";

/**
 * Parses an interface declaration node.
 * @param typeChecker The type checker instance.
 * @param node The node to parse.
 * @returns The type information, or null if not able to be parsed.
 */
export function parseInterfaceDeclaration(typeChecker: ts.TypeChecker, node: ts.Node): TypeInfo | null {
  const type = typeChecker.getTypeAtLocation(node);
  const symbol = type.getSymbol();
  if (!symbol) return null;
  if (!type.isClassOrInterface()) return null;

  const { name } = symbol;
  const description = parseDescription(typeChecker, symbol);
  const fields = parseFields(typeChecker, type);

  return {
    id: name,
    type: "interface",
    actualType: "interface",
    name,
    description,
    fields
  };
}
