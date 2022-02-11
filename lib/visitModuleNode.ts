import ts, { NodeBuilderFlags } from "typescript";
import { ComponentMetadata } from "./ComponentMetadata";
import { isNodeExported } from "./isNodeExported";
import { visitChildNode } from "./visitChildNode";

/**
 * Processes a module level node.
 * @param typeChecker The type checker instance.
 * @param node The node to visit.
 * @returns The metadata for the first found component, or null if none found.
 */
export function visitModuleNode(typeChecker: ts.TypeChecker, node: ts.Node): ComponentMetadata | null {
  if (!isNodeExported(node)) return null;
  if (!ts.isVariableStatement(node)) return null;
  return ts.forEachChild(node, (node) => visitChildNode(typeChecker, node)) ?? null;
}
