import nlp from "compromise";
import { findItemsFromDoc } from "../lib/doc-helpers.js";

const addGetAppearance = nlp.extend({
  api: (View) => {
    View.prototype.getAppearance = function () {
      const allItemsOn = true;
      const allItemsOff = false;

      // Body
      const bodyParts = findItemsFromDoc(
        "#BodyPart",
        "bodypart",
        this,
        allItemsOff
      );

      // Hair
      const hair = findItemsFromDoc(
        "#HairStyle",
        "hairstyle",
        this,
        allItemsOn
      );

      // Facial Hair
      const facialHair = findItemsFromDoc(
        "#FacialHair",
        "facialhair",
        this,
        allItemsOn
      );
      
      


      // Clothing
      const clothing = findItemsFromDoc(
        "#Clothing",
        "clothing",
        this,
        allItemsOn
      );

      return { bodyparts: bodyParts, clothes: clothing, hair: hair, facialhair: facialHair };
    };
  },
});

export default addGetAppearance;
