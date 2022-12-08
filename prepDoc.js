import nlp from "compromise";
import disambiguation from "compromise.disambiguation";
import tagCharName from "./doc-info-getters/find-character-references.js";

export default function prepDoc(doc) {
  nlp.plugin(disambiguation);
  doc.disambiguate();
  tagCharName(doc);
}
