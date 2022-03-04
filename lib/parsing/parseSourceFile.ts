import ts from "typescript";
import { isNodeExported } from "./isNodeExported";
import { TypeInfo } from "../model";
import { parseExportDeclaration, parseInterfaceDeclaration, parseVariableStatement, parseFunctionDeclaration } from ".";

/**
 * Parses the specified source file.
 * @param typeChecker The type checker instance.
 * @param sourceFile The source file.
 * @returns The set of supported types within the source file.
 */
export function parseSourceFile(typeChecker: ts.TypeChecker, sourceFile: ts.SourceFile): ReadonlyArray<TypeInfo> {
  const result: Array<TypeInfo> = [];

  ts.forEachChild(sourceFile, (node) => {
    if (!isNodeExported(node)) return;

    let type: TypeInfo | null = null;

    if (ts.isVariableStatement(node)) {
      type = parseVariableStatement(typeChecker, node);
    } else if (ts.isInterfaceDeclaration(node)) {
      type = parseInterfaceDeclaration(typeChecker, node);
    } else if (ts.isExportDeclaration(node)) {
      type = parseExportDeclaration(typeChecker, node);
    } else if (ts.isFunctionDeclaration(node)) {
      type = parseFunctionDeclaration(typeChecker, node);
    }

    if (type) result.push(type);
  });

  return result;
}
