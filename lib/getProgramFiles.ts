import glob from "glob";

/**
 * Gets the set of files.
 * @param globs The globs to get the files from.
 * @returns The array of files.
 */
export async function getProgramFiles(globs: ReadonlyArray<string>): Promise<ReadonlyArray<string>> {
  const paths = new Set<string>();

  for (const path of globs) {
    const matches = await new Promise<string[]>((resolve, reject) => {
      glob(path, { cwd: process.cwd() }, (err, matches) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(matches);
      });
    });

    for (const match of matches)
      paths.add(match);
  }

  return Array.from(paths);
}
