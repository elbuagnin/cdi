import nlp from "compromise";
import * as mfs from "../lib/filesystem.js";
import { tagsPath, wordsPath } from "../data-interface/data-file-structure.js";

export default function initialize() {
  console.log(tagsPath);
  const tags = mfs.loadJSONDir(tagsPath);
  const words = mfs.loadJSONDir(wordsPath);
  console.log(JSON.stringify(tags));
  nlp.addTags(tags);
  nlp.addWords(words);
}
