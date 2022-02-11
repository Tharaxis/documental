import ts from "typescript";

/**
 * Indicates whether the specified node is exported.
 * @param node The node to check.
 * @returns True if the node is exported, otherwise false.
 */
export function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}
