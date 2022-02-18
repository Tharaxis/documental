import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";

/**
 * Loads the specified set of partials and registers them with Handlebars.
 * @param cwd The current working directory.
 * @param partials The paths to the partials to load.
 */
export async function loadPartials(cwd: string, partials: Readonly<Record<string, string>>): Promise<void> {
  for (const key of Object.keys(partials)) {

    const partialPath = partials[key];
    const absolutePartialPath = path.resolve(cwd, partialPath);
    const partialBuffer = await fs.readFile(absolutePartialPath);
    const partialContent = partialBuffer.toString("utf8");

    handlebars.registerPartial(key ,partialContent);
  }
}
