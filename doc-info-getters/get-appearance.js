import nlp from "compromise";
import { findItemsFromDoc } from "../lib/doc-helpers.js";

const addGetAppearance = nlp.extend({
  api: (View) => {
    View.prototype.getAppearance = function () {
      this.match("hair").debug();
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
      console.log(JSON.stringify(hair));
      const mentions = hair.items.length;
      console.log("mentions of hair " + mentions);

      if (mentions > 0) {
        let hairstyleEntry = null;
        hair.items.forEach((item) => {
          if (item.descripters.length > 0) {
            console.log(item.descripters);
            hairstyleEntry = item;
          } else {
            hairstyleEntry = item.hairstyle;
          }

        });

        
      }

      // Clothing
      const clothing = findItemsFromDoc(
        "#Clothing",
        "clothing",
        this,
        allItemsOn
      );

      return { bodyparts: bodyParts, clothes: clothing };
    };
  },
});

export default addGetAppearance;
