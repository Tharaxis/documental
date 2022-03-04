import path from "path";
import ts from "typescript";
import { TypeInfo } from "../model";

/**
 * Parses an export declaration node.
 * @param typeChecker The type checker instance.
 * @param exportDeclaration The export declaration.
 * @returns The type information, or null if not able to be parsed.
 */
export function parseExportDeclaration(typeChecker: ts.TypeChecker, exportDeclaration: ts.ExportDeclaration): TypeInfo | null {
  const { moduleSpecifier, exportClause } = exportDeclaration;

  if (!moduleSpecifier) return null;
  if (!ts.isStringLiteral(moduleSpecifier)) return null;

  const { text } = moduleSpecifier;
  let name = path.parse(text).name;

  // TODO: right now we parse wildcard exports only, in the future we can try parse others.
  if (exportClause) {
    if (ts.isNamespaceExport(exportClause)) {
      name = exportClause.name.text;
    } else {
      return null;
    }
  }

  return {
    id: text,
    type: "export",
    actualType: "export",
    name,
    path: text,
    description: undefined
  }
}
