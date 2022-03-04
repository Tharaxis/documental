import ts from "typescript";
import { parseDescription, parseFields } from ".";
import { TypeInfo } from "../model";

/**
 * Parses a function declaration node.
 * @param typeChecker The type checker instance.
 * @param node The node to parse.
 * @returns The type information, or null if not able to be parsed.
 */
export function parseFunctionDeclaration(typeChecker: ts.TypeChecker, declaration: ts.FunctionDeclaration): TypeInfo | null {
  const { name } = declaration;
  if (!name) return null;

  const symbol = typeChecker.getSymbolAtLocation(name);

  if (!symbol) return null;

  const description = parseDescription(typeChecker, symbol);

  return {
    id: name.text,
    type: "function",
    actualType: "function",
    name: name.text,
    description
  };
}
