import path from "path";
import { fileURLToPath } from "url";

const here = fileURLToPath(new URL(".", import.meta.url));
const baseDir = path.join(here, "../");
const worldInitData = path.join(baseDir, "/startup/world-initialization-data");
const tagsPath = path.join(worldInitData, "tags/");
const wordsPath = path.join(worldInitData, "words/");

export {
  baseDir, worldInitData, tagsPath, wordsPath
};
