import fs from "fs/promises";
import path from "path";

/**
 * Loads the specified set of templates.
 * @param cwd The current working directory.
 * @param templates The paths to the templates to load.
 * @returns The set of templates.
 */
export async function loadTemplates(cwd: string, templates: Readonly<Record<string, string>>): Promise<ReadonlyMap<string, string>> {
  const result = new Map<string, string>();

  for (const key of Object.keys(templates)) {

    const templatePath = templates[key];
    const absoluteTemplatePath = path.resolve(cwd, templatePath);
    const templateBuffer = await fs.readFile(absoluteTemplatePath);

    result.set(key, templateBuffer.toString("utf8"));
  }

  return result;
}
