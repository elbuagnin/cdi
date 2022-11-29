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

      // Hair
      const hair = new Describer("#HairStyle", this, allItems);

      // Facial Hair
      const facialHair = new Describer("#FacialHair", this, allItems);

      // Clothing
      const clothing = new Describer("#Clothing", this, allItems);

      return {
        bodyparts: bodyParts.terms,
        bodytype: bodyType.terms,
        clothes: clothing.terms,
        hair: hair.terms,
        facialhair: facialHair.terms,
      };
    };
  },
});

export default addGetAppearance;
