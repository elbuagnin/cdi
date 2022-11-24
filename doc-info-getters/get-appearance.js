import nlp from "compromise";
import { mergeDuplicates, isModifiedBy } from "../lib/doc-helpers.js";

const addGetAppearance = nlp.extend({
  api: (View) => {
    View.prototype.getAppearance = function () {
      // Body
      const bodyParts = [];
      const bodyPartTerms = this.match("#BodyPart");
      bodyPartTerms.forEach((bodyPartTerm) => {
        let descripters = isModifiedBy(bodyPartTerm, this);
        if (descripters.length > 0) {
          let nlpData = { bodypart: bodyPartTerm, descripters: descripters };
          let bodyData = {
            bodypart: bodyPartTerm.text(),
            descripters: descripters.map((term) => term.text()),
          };
          let obj = { bodydata: bodyData, nlpdata: nlpData };
          bodyParts.push(obj);
        }
      });

      // Clothing
      const rawClothingList = [];
      const clothingTerms = this.match("#Clothing");

      clothingTerms.forEach((clothingTerm) => {
        let descripters = isModifiedBy(clothingTerm, this);

        let nlpData = { clothing: clothingTerm, descripters: descripters };

        let clothingData = {
          clothing: clothingTerm.text(),
          descripters: descripters.map((term) => term.text()),
        };

        let obj = { clothingdata: clothingData, nlpdata: nlpData };

        rawClothingList.push(obj);
      });

      const clothing = mergeDuplicates(
        rawClothingList.map((item) => item.clothingdata)
      );
      console.log("merged" + JSON.stringify(clothing));

      return { bodyparts: bodyParts, clothing: clothing };
    };
  },
});

export default addGetAppearance;
