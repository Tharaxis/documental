import ts from "typescript";
import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import { parseDocumentalMetadata } from "./parseDocumentalMetadata";
import { visitModuleNode } from "./visitModuleNode";
import { loadConfiguration } from "./loadConfiguration";
import { loadTemplates } from "./loadTemplates";
import { getProgramFiles } from "./getProgramFiles";

/**
 * The main application entry point.
 * @param cwd The current working directory.
 */
export async function main(cwd: string): Promise<void> {
  try {
    console.log();
    console.log("Documental")
    console.log("----------");
    console.log();

    const { files, templates } = await loadConfiguration(cwd);

    if (!files || files.length === 0) throw new Error("No files specified.");
    if (!templates) throw new Error("No templates specified.");

    const paths = await getProgramFiles(cwd, files);
    if (paths.length === 0) throw new Error("No files found.");

    const program = ts.createProgram(paths, {
      target: ts.ScriptTarget.ES2015,
      module: ts.ModuleKind.CommonJS,
    });

    const typeChecker = program.getTypeChecker();
    const templateTable = await loadTemplates(cwd, templates ?? {});

    for (const sourceFile of program.getSourceFiles()) {
      if (sourceFile.isDeclarationFile) continue;

      const documentalInfo = parseDocumentalMetadata(sourceFile);
      if (!documentalInfo) continue;

      const template = templateTable[documentalInfo.template];
      if (!template) {
        console.log(`Template '${documentalInfo.template}' not found. Skipping.`);
        continue;
      }

      const component = ts.forEachChild(sourceFile, (node) => visitModuleNode(typeChecker, node)) ?? null;
      if (!component) continue;

      console.log(`Processing component in file: ${sourceFile.fileName}`);

      const compiledTemplate = handlebars.compile(
        `${template}\n##### Generated with [Documental](https://github.com/Tharaxis/documental)`,
        { noEscape: true }
      );

      const result = compiledTemplate({
        ...component,
        ...documentalInfo.fields,
        name: documentalInfo.name ?? component.name,
      });

      await fs.writeFile(path.resolve(documentalInfo.path, "./README.md"), result, { encoding: "utf-8" });
    }
  } catch {
  } finally {
  }
}
