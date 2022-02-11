import fs from "fs/promises";
import path from "path";

/**
 * Loads the specified set of templates.
 * @param templates The paths to the templates to load.
 */
export async function loadTemplates(templates: Readonly<Record<string, string>>): Promise<Readonly<Record<string, string>>> {
  const result: Record<string, string> = {};

  for (const key of Object.keys(templates)) {

    const templatePath = templates[key];
    const absoluteTemplatePath = path.resolve(process.cwd(), templatePath);
    const templateBuffer = await fs.readFile(absoluteTemplatePath);

    result[key] = templateBuffer.toString("utf8");
  }

  return result;
}
