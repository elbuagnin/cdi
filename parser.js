import nlp from "compromise";
import syntax from "compromise.syntax";

export default function parseDoc(doc) {

  nlp.plugin(syntax);
  doc.syntax();

 
}
