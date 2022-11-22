import { CDIOptions } from "../../startup/CDIConfig.js";

export default function makeCompleteSentences(doc) {
  function isCompleteSentence(sentence) {
    const isThereAVerb = sentence.has("#Verb");
    const isThereAPrincipalCharacter = sentence.has(name);

    if (isThereAPrincipalCharacter && isThereAVerb) {
      return true;
    } else {
      return false;
    }
  }

  const name = CDIOptions.name;
  const sentences = doc.sentences();

  sentences.forEach((sentence) => {
    if (!isCompleteSentence(sentence)) {
      const firstWord = sentence.match(".").firstTerms();

      if (firstWord.has("#Verb")) {
        sentence.insertBefore(name);
      }
      if (firstWord.has("#Adverb")) {
        sentence.insertBefore(name + " is");
      }
      if (firstWord.has("#Adjective")) {
        sentence.insertBefore(name + " has");
      }
      if (firstWord.has("#Pronoun") || firstWord.has("#Possessive")) {
        //
      } else if (firstWord.has("#Noun")) {
        sentence.insertBefore(name + " has");
      }
    }
  });
}
