import fs from "fs/promises";
import path from "path";
import { Configuration } from "./Configuration";

/**
 * Loads the configuration file.
 * @param cwd The current working directory.
 * @returns The configuration.
 */
export async function loadConfiguration(cwd: string): Promise<Configuration> {
  const configurationPath = path.resolve(cwd, "./documental.json");
  const buffer = await fs.readFile(configurationPath);
  const json = JSON.parse(buffer.toString("utf8")) as Configuration;

  return json;
}
