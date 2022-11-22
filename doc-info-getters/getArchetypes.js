import nlp from "compromise";
import subTags from "../lib/doc-helpers.js";

const addGetArchetypes = nlp.extend({
  api: (View) => {
    View.prototype.getArchetypes = function () {
      const archetypeTermsList = nlp.model().one.tagSet.Archetype.children;
      const archetypeCluesList = nlp.model().one.tagSet.ArchetypeClue.children;

      const docArchetypeTermsFound = this.match("#Archetype");
      const docArchetypeTerms = subTags(docArchetypeTermsFound, archetypeTermsList);

      const docArchetypeCluesFound = this.match("#ArchetypeClue");
      const docArchetypeClues = subTags(docArchetypeCluesFound, archetypeCluesList);
      
      const mergedResults = [].concat(docArchetypeTerms, docArchetypeClues);
      mergedResults.forEach(element => {
        if (element.subtag.indexOf("Type") > 0 ) {
          element.archetype = element.subtag.substr(0,element.subtag.indexOf("Type"));
        }
        if (element.subtag.indexOf("Word") > 0 ) {
          element.archetype = element.subtag.substr(0,element.subtag.indexOf("Word"));
        }
        return element;
      })
      console.log(mergedResults);
    };
  },
});

export default addGetArchetypes;
