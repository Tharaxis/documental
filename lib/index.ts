import ts from "typescript";
import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import { loadConfiguration } from "./loadConfiguration";
import { loadTemplates } from "./loadTemplates";
import { getProgramFiles } from "./getProgramFiles";
import { DocumentationNode, IndexDocumentationNode, TypeInfo } from "./model";
import { parseSourceFile, parseDocumentationNode } from "./parsing";
import { loadPartials } from "./loadPartials";
import * as helpers from "./helpers";

function generateDocumentNodeLookups(cwd: string, sourceFiles: ReadonlyArray<ts.SourceFile>): [
  ReadonlyMap<string, ReadonlyArray<DocumentationNode>>,
  ReadonlyMap<string, DocumentationNode>
] {
  const documentationNodes = new Map<string, Array<DocumentationNode>>();
  const documentationNodeLookup = new Map<string, DocumentationNode>();

  for (const sourceFile of sourceFiles) {
    if (sourceFile.isDeclarationFile) continue;

    const documentationNode = parseDocumentationNode(cwd, sourceFile);
    if (!documentationNode) continue;

    const dir = path.parse(documentationNode.path).dir;
    let nodes = documentationNodes.get(dir) || [];
    nodes.push(documentationNode);

    documentationNodes.set(dir, nodes);
    documentationNodeLookup.set(documentationNode.path, documentationNode);
  }

  return [documentationNodes, documentationNodeLookup];
}

function parseTypes(cwd: string, sourceFiles: ReadonlyArray<ts.SourceFile>, typeChecker: ts.TypeChecker):
  ReadonlyMap<string, ReadonlyArray<TypeInfo>>
{
  const result = new Map<string, ReadonlyArray<TypeInfo>>();

  for (const sourceFile of sourceFiles) {
    const { fileName } = sourceFile;
    const types = parseSourceFile(typeChecker, sourceFile);
    result.set(path.resolve(cwd, fileName), types);
  }

  return result;
}

async function writeDocuments(
  documentPathMap: ReadonlyMap<string, ReadonlyArray<DocumentationNode>>,
  typePathMap: ReadonlyMap<string, ReadonlyArray<TypeInfo>>,
  templateMap: ReadonlyMap<string, string>
): Promise<void> {
  for (const [directoryName, nodes] of documentPathMap) {
    const indexNode = nodes.find((node) => node.type === "index") as IndexDocumentationNode | undefined;
    const template = indexNode?.template ?? "default-template";
    const templateSource = templateMap.get(template);

    if (!templateSource) {
      console.log(`Documentation template '${template}' not found for '${directoryName}', skipping.`);
      continue;
    }

    const documentData = indexNode?.data ?? {}
    const documentedTypes: Array<TypeInfo & Readonly<Record<string, unknown>>> = [];

    for (const documentationNode of nodes) {
      const { path, data: globalData, exports } = documentationNode;
      const types = typePathMap.get(path);

      if (!types) continue;

      for (const type of types) {
        const exportData = exports.get(type.id) ?? exports.get("*");
        if (!exportData) continue;

        // TODO: we should exclude from data/exportData any fields whose names match those in type that are non-string values, as well as the field.
        // TODO: this is so that we allow overriding individual string data, but not more underlying complex data.
        documentedTypes.push({
          ...globalData,
          ...type,
          ...exportData
        });
      }
    }

    const compiledTemplate = handlebars.compile(
      `${templateSource}\n##### Generated with [Documental](https://github.com/Tharaxis/documental)`,
      { noEscape: true }
    );

    const result = compiledTemplate({
      ...documentData,
      types: documentedTypes
    });

    await fs.writeFile(path.resolve(directoryName, "./README.md"), result, { encoding: "utf-8" });
  }
}


/**
 * The main application entry point.
 * @param cwd The current working directory.
 */
export async function main(cwd: string): Promise<void> {
  try {
    const { basePath = cwd, files, templates, partials = {} } = await loadConfiguration(cwd);

    if (!files || files.length === 0) throw new Error("No files specified.");
    if (!templates) throw new Error("No templates specified.");

    const paths = await getProgramFiles(basePath, files);
    if (paths.length === 0) throw new Error("No files found.");

    const program = ts.createProgram(paths, {
      target: ts.ScriptTarget.ES2015,
      module: ts.ModuleKind.CommonJS,
    });

    const typeChecker = program.getTypeChecker();
    let sourceFiles = program.getSourceFiles();
    const [documentationNodes, documentationNodeLookup] = generateDocumentNodeLookups(basePath, sourceFiles);
    sourceFiles = sourceFiles.filter(({ fileName }) => !!documentationNodeLookup.get(path.resolve(basePath, fileName)));

    handlebars.registerHelper(helpers);

    await loadPartials(basePath, partials);

    await writeDocuments(
      documentationNodes,
      parseTypes(basePath, sourceFiles, typeChecker),
      await loadTemplates(basePath, templates ?? {}));

  } catch(err) {
    console.log(err);
  } finally {
  }
}
