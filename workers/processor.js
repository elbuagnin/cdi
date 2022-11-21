import tagCharName from "../sequencing-data/doc-processors/find-character-references.js";
import makeCompleteSentences from "../sequencing-data/doc-processors/make-complete-sentences.js";

export default function runProcess(doc, payload) {
  const { process } = payload;

  switch (process) {
    case 'tag-char-refs':
      tagCharName(doc);
      break;
    case 'make-complete-sentences':
      makeCompleteSentences(doc);
      break;
    default:
      break;
  }
}
