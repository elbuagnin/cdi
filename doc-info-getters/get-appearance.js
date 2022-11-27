import nlp from "compromise";
import { findItemsFromDoc } from "../lib/doc-helpers.js";
import { tagIsh } from "../lib/doc-helpers.js";

const addGetAppearance = nlp.extend({
  api: (View) => {
    View.prototype.getAppearance = function () {
      const localDoc = this.clone();
      tagIsh(localDoc);

      const allItemsOn = true;
      const allItemsOff = false;

      // Body
      const bodyParts = findItemsFromDoc(
        "#BodyPart",
        "bodypart",
        localDoc,
        allItemsOff
      );

      // Bodytype
      const bodyType = findItemsFromDoc(
        "#BodyType",
        "bodytype",
        localDoc,
        allItemsOn
      );

      // Hair
      const hair = findItemsFromDoc(
        "#HairStyle",
        "hairstyle",
        localDoc,
        allItemsOn
      );

      // Facial Hair
      const facialHair = findItemsFromDoc(
        "#FacialHair",
        "facialhair",
        localDoc,
        allItemsOn
      );

      // Clothing
      const clothing = findItemsFromDoc(
        "#Clothing",
        "clothing",
        localDoc,
        allItemsOn
      );

      return {
        bodyparts: bodyParts,
        bodytype: bodyType,
        clothes: clothing,
        hair: hair,
        facialhair: facialHair,
      };
    };
  },
});

export default addGetAppearance;
