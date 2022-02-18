import ts from "typescript";
import { parse as parseComment, Spec } from "comment-parser";
import path from "path";
import { DocumentationNode } from "../model/DocumentationNode";
import unescapeJs from "unescape-js";

/**
 * Cleaned the specified text value.
 * @param value The text to clean.
 * @returns The cleaned text.
 */
function cleanValue(value: string): string {
  let currentValue = unescapeJs(value.trim());

  while (true) {
    const newValue = currentValue.replace("\\/*", "/*").replace("*\\/", "*/");
    if (newValue === currentValue) break;

    currentValue = newValue;
  }

  return currentValue;
}

/**
 * Gets values from the set of specified tags, and returns back remaining unprocessed tags.
 * @param tags The tags to process the values from.
 * @returns A tuple containing the values as well as the set of remaining tags.
 */
function getValues(tags: ReadonlyArray<Spec>): [data: Readonly<Record<string, string>>, remaining: ReadonlyArray<Spec>] {
  let result: Record<string, string> = {};

  while (tags.length > 0) {
    let [nextTag, ...remaining] = tags;
    const { tag, name, description } = nextTag;

    if (tag === "export") {
      return [result, tags];
    }

    result[tag] = cleanValue(name || description || "");
    tags = remaining;
  }

  return [result, []];
}

/**
 * Parses the documentation node data from the specified source file.
 * @param sourceFile The source file to parse.
 * @returns Documentation node data or null if not specified.
 */
export function parseDocumentationNode(cwd: string, sourceFile: ts.SourceFile): DocumentationNode | null {
  const fullText = sourceFile.getFullText();
  const fileName = path.resolve(cwd, sourceFile.fileName);

  const { name: sourceName } = path.parse(path.resolve(cwd, fileName));

  const commentRanges = ts.getLeadingCommentRanges(fullText, 0);

  if (!commentRanges || commentRanges.length === 0) return null;

  const [candidate] = commentRanges;

  const comment = fullText.substring(candidate.pos, candidate.end);
  const [parsedComment] = parseComment(comment, { spacing: "preserve" });
  const tags = parsedComment?.tags ?? [];

  if (tags.length === 0) return null;

  let rest: ReadonlyArray<Spec>;
  let currentTag: Spec;

  [currentTag, ...rest] = tags;

  // First tag must be @documental
  if (currentTag.tag !== "documental") return null;

  const type = (sourceName === "index") ? "index" : "source";
  let template: string | undefined;
  let data: Readonly<Record<string, string>> = {};
  const exports = new Map<string, Record<string, string>>();

  // Run through each tag.
  while (rest.length > 0) {
    let remaining: ReadonlyArray<Spec>;

    [currentTag, ...remaining] = rest;
    const { tag, name } = currentTag;
    let values: Readonly<Record<string, string>>;

    if (tag === "export") {
      [values, rest] = getValues(remaining);
      if (name === "*") exports.set("*", {});
      else exports.set(name, values);
    } else {
      [values, rest] = getValues(rest);

      if (type === "index") {
        const {template: selectedTemplate, ...remainingData} = values;
        template = selectedTemplate;
        data = remainingData;
      }
    }
  }

  return (type === "index") ?
    { type: "index", template, data, path: fileName, exports } :
    { type: "source", data, path: fileName, exports };
}
