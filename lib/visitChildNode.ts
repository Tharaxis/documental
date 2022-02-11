import ts from "typescript";
import { parseDeclarationInfo } from "./parseDeclarationInfo";
import { isComponentType } from "./isComponentType";
import { parseComponentProperties } from "./parseComponentProperties";
import { ComponentMetadata } from "./ComponentMetadata";

/**
 * Processes a child node.
 * @param typeChecker The type checker instance.
 * @param node The node to visit.
 * @returns The component metadata, otherwise null.
 */
export function visitChildNode(typeChecker: ts.TypeChecker, node: ts.Node): ComponentMetadata | null {
  if (!ts.isVariableDeclarationList(node)) return null;

  const parsedDeclarationInfo = parseDeclarationInfo(typeChecker, node);
  if (!parsedDeclarationInfo) return null;

  // Get the information of the variable being declared and assigned.
  const [name, description, type] = parsedDeclarationInfo;

  // Check if we're assigning a component type.
  if (!isComponentType(type)) return null;

  const properties = parseComponentProperties(typeChecker, type);

  return {
    name,
    description,
    properties
  };
}
