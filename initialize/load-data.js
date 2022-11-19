import nlp from "compromise";
import * as mfs from "../lib/filesystem.js";
const baseDir = "./initialize/";
const tagDir = baseDir + "tags/";
const wordDir = baseDir + "words/";

const tags = mfs.loadJSONDir(tagDir);
const words = mfs.loadJSONDir(wordDir);

nlp.addTags(tags);
nlp.addWords(words);

