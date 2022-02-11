import ts from "typescript";
import { parse as parseComment } from "comment-parser";
import path from "path";
import { DocumentalMetadata } from "./DocumentalMetadata";
import unescapeJs from "unescape-js";

/**
 * Cleaned the specified text value.
 * @param value The text to clean.
 * @returns The cleaned text.
 */
function cleanValue(value: string): string {
  let currentValue = unescapeJs(value.trim());

  while (true) {
    const newValue = currentValue.replace("\\/*", "/*") .replace("*\\/", "*/");
    if (newValue === currentValue) break;

    currentValue = newValue;
  }

  return currentValue;
}

/**
 * Parses the documental metadata from the specified source file.
 * @param sourceFile The source file to parse.
 * @returns Documental info or null if not specified.
 */
export function parseDocumentalMetadata(sourceFile: ts.SourceFile): DocumentalMetadata | null {
  const fullText = sourceFile.getFullText();
  const commentRanges = ts.getLeadingCommentRanges(fullText, 0);

  if (!commentRanges || commentRanges.length === 0) return null;

  const [candidate] = commentRanges;

  const comment = fullText.substring(candidate.pos, candidate.end);
  const [parsedComment] = parseComment(comment, { spacing: "preserve" });
  const tags = parsedComment?.tags ?? [];

  if (tags.length === 0) return null;
  const [firstTag] = tags;

  if (firstTag.tag !== "documental") return null;

  const nameTag = tags.find(({ tag }) => tag === "name");
  const templateTag = tags.find(({ tag }) => tag === "template");

  if (!templateTag) return null;

  const fields: Record<string, string> = {};

  for (const tag of tags) {
    const { tag: tagName, description } = tag;

    if (tagName === "documental") continue;
    if (tagName === "name") continue;
    if (tagName === "template") continue;

    fields[tagName] = cleanValue(description ?? "");
  }

  const sourcePath = path.parse(sourceFile.fileName).dir;

  let name = nameTag?.description;
  if (name) name = cleanValue(name);

  let template = templateTag?.description;
  if (template) template = cleanValue(template);

  return {
    path: sourcePath,
    name,
    template,
    fields: fields
  };
}
