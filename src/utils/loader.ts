import { sync } from "glob";
import Logger from "../core/logger";

/**
 * Loads the directory
 * @param dir - directory to load
 * @returns
 */
export default async function loadFolder(dir: string) {
  let status = process.env.STATUS as string;
  const logger = new Logger("Loader");

  try {
    let path =
      status === "DEVELOPMENT"
        ? `./src/modules/${dir}/**/*.ts`
        : `./build/modules/${dir}/**/*.js`;
    let files: string[] = sync(path);
    let loaded: string[] = [];
    for (let file of files) {
      await import(
        file.replace(status === "DEVELOPMENT" ? "src" : "build", "../")
      );
      loaded.push(file);
    }

    logger.debug(`Loaded ${loaded.length} In ${dir} Folder!`);
  } catch (err) {
    logger.error(err);
    return null;
  }
}
