import nlp from "compromise";
import { mergeDuplicates, isModifiedBy } from "../lib/doc-helpers.js";

const addGetAppearance = nlp.extend({
  api: (View) => {
    View.prototype.getAppearance = function () {
      // Body
      const rawBodyPartsList = [];
      const bodyPartsNLPData = [];
      const bodyPartTerms = this.match("#BodyPart");

      bodyPartTerms.forEach((bodyPartTerm) => {
        let descripters = isModifiedBy(bodyPartTerm, this);
        if (descripters.length > 0) {
          let nlpData = { bodypart: bodyPartTerm, descripters: descripters };
          bodyPartsNLPData.push(nlpData);

          let bodyData = {
            bodypart: bodyPartTerm.text(),
            descripters: descripters.map((term) => term.text()),
          };
          rawBodyPartsList.push(bodyData);
        }
      });

      const bodyPartsList = mergeDuplicates(rawBodyPartsList);
      const bodyParts = {items: bodyPartsList, nlpData: bodyPartsNLPData};

      // Clothing
      const rawClothingList = [];
      const clothingNLPData = [];
      const clothingTerms = this.match("#Clothing");

      clothingTerms.forEach((clothingTerm) => {
        let descripters = isModifiedBy(clothingTerm, this);

        let nlpData = { clothing: clothingTerm, descripters: descripters };
        clothingNLPData.push(nlpData);

        let clothingData = {
          clothing: clothingTerm.text(),
          descripters: descripters.map((term) => term.text()),
        };
        rawClothingList.push(clothingData);
      });

      const clothingList = mergeDuplicates(rawClothingList);
      const clothing = {items: clothingList, nlpData: clothingNLPData};

      return { bodyparts: bodyParts, clothing: clothing };
    };
  },
});

export default addGetAppearance;
