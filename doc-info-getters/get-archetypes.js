import nlp from "compromise";
import { subTags } from "../lib/doc-helpers.js";

const addGetArchetypes = nlp.extend({
  api: (View) => {
    View.prototype.getArchetypes = function () {
      const archetypeTermsList = nlp.model().one.tagSet.Archetype.children;
      const archetypeCluesList = nlp.model().one.tagSet.ArchetypeClue.children;

      const docArchetypeTermsFound = this.match("#Archetype");
      const docArchetypeTerms = subTags(
        docArchetypeTermsFound,
        archetypeTermsList
      );

      const docArchetypeCluesFound = this.match("#ArchetypeClue");
      const docArchetypeClues = subTags(
        docArchetypeCluesFound,
        archetypeCluesList
      );

      const mergedResults = [].concat(docArchetypeTerms, docArchetypeClues);

      mergedResults.forEach((element) => {
        if (element.subtag.indexOf("Type") > 0) {
          element.archetype = element.subtag.substr(
            1,
            element.subtag.indexOf("Type") - 1
          );
          element.weight = 1;
        }
        if (element.subtag.indexOf("Word") > 0) {
          element.archetype = element.subtag.substr(
            1,
            element.subtag.indexOf("Word") - 1
          );
          element.weight = 0.5;
        }
        return element;
      });

      const weightedResults = [];
      let sumOfResults = 0;

      archetypeTermsList.forEach((term) => {
        const rootTerm = term.substr(0, term.length - 4);
        const count = mergedResults.filter((element) => {
          if (element.archetype === rootTerm) {
            return true;
          } else {
            return false;
          }
        }).length;

        const obj = { archetype: rootTerm, count: count };
        weightedResults.push(obj);

        sumOfResults += count;
      });

      const archetypeMakeup = weightedResults.map((oldElement) => {
        const percentage = oldElement.count / sumOfResults;
        const newObj = {
          archetype: oldElement.archetype,
          percentage: percentage,
        };
        return newObj;
      });

      return { makeup: archetypeMakeup, termData: mergedResults };
    };
  },
});

export default addGetArchetypes;
