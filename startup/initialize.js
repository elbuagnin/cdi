import nlp from "compromise";
import * as mfs from "../lib/filesystem.js";
import { tagsPath, wordsPath } from "../data-interface/data-file-structure.js";

export default function initialize() {
  
  const tags = mfs.loadJSONDir(tagsPath);
  const words = mfs.loadJSONDir(wordsPath);
  
  nlp.addTags(tags);
  nlp.addWords(words);
}
