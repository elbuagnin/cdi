import nlp from "compromise";
import syntax from "compromise.syntax";
import tagCharName from "./doc-info-getters/find-character-references.js";

export default function prepDoc(doc) {
  nlp.plugin(syntax);
  doc.syntax();

  tagCharName(doc);
}
