import ts from "typescript";

/**
 * Parses the description for the specified symbol.
 * @param typeChecker The type checker instance.
 * @param symbol The symbol to parse description text from.
 * @returns The description.
 */
export function parseDescription(typeChecker: ts.TypeChecker, symbol: ts.Symbol): string {
  const descriptionElements: Array<string> = [];
  for (const comment of symbol.getDocumentationComment(typeChecker)) {
    const { kind, text } = comment;
    if (kind !== "text") continue;

    descriptionElements.push(text.replace(/\r?\n/, " "));
  }

  return descriptionElements.join("\n\n");
}
