import nlp from "compromise";
import * as mfs from "../lib/filesystem.js";
import { tagsPath, wordsPath } from "../lib/data-file-structure.js";
import "./addGetterMethods.js";

export default function initialize() {
  
  const tags = mfs.loadJSONDir(tagsPath);
  const words = mfs.loadJSONDir(wordsPath);
  
  nlp.addTags(tags);
  nlp.addWords(words);
}
