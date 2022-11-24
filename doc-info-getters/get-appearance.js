import nlp from "compromise";
import { findItemsFromDoc } from "../lib/doc-helpers.js";

const addGetAppearance = nlp.extend({
  api: (View) => {
    View.prototype.getAppearance = function () {
        const allItemsOn = true;
        const allItemsOff = false;

        // Body
      const bodyParts = findItemsFromDoc("#BodyPart", "bodypart", this, allItemsOff);

      // Clothing
      const clothing = findItemsFromDoc("#Clothing", "clothing", this, allItemsOn);


      return { bodyparts: bodyParts, clothes: clothing };
    };
  },
});

export default addGetAppearance;
