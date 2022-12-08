import nlp from "compromise";
import { Describer } from "./character-data-class.js";

const addGetAppearance = nlp.plugin({
  api: (View) => {
    View.prototype.getAppearance = function () {
      const describedOnly = true;
      const allItems = false;

      // Body
      const bodyParts = new Describer("#BodyPart", this, describedOnly);

      // Bodytype
      const bodyType = new Describer("#BodyType", this, allItems);

      // Hairstyles
      const hairStyles = new Describer("#HairStyle", this, allItems);

      // Facial Hair
      const facialHair = new Describer("#FacialHair", this, allItems);

      // Clothing
      const clothing = new Describer("#Clothing", this, allItems);

      // Also, add styles as descripters to bodyParts.
      if (hairStyles.terms.length > 0) {
        bodyParts.addDetails(
          "hair",
          hairStyles.terms.map((item) => item.hairstyle)
        );
      }

      // Also, add facial hair as parts to bodyParts.
      if (facialHair.terms.length > 0) {
        bodyParts.addDetails(
          "face",
          facialHair.terms,
          "parts"
        );
      }

      return {
        bodyparts: bodyParts.terms,
        bodytype: bodyType.terms,
        clothes: clothing.terms,
        hair: hairStyles.terms,
        facialhair: facialHair.terms,
      };
    };
  },
});

export default addGetAppearance;
