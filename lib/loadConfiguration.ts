import fs from "fs/promises";
import path from "path";
import { Configuration } from "./Configuration";

/**
 * Loads the configuration file.
 */
export async function loadConfiguration(): Promise<Configuration> {
  const configurationPath = path.resolve(process.cwd(), "./documental.json");
  const buffer = await fs.readFile(configurationPath);
  const json = JSON.parse(buffer.toString("utf8")) as Configuration;

  return json;
}
