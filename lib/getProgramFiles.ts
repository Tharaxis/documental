import glob from "glob";
import path from "path";

/**
 * Gets the set of files.
 * @param cwd The current working directory to search from.
 * @param globs The globs to get the files from.
 * @returns The array of files.
 */
export async function getProgramFiles(cwd: string, globs: ReadonlyArray<string>): Promise<ReadonlyArray<string>> {
  const paths = new Set<string>();

  for (const globPath of globs) {
    const matches = await new Promise<string[]>((resolve, reject) => {
      glob(globPath, { cwd }, (err, matches) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(matches);
      });
    });

    for (const match of matches)
      paths.add(path.resolve(cwd, match));
  }

  return Array.from(paths);
}
