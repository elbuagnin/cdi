import nlp from "compromise";
import { Describer } from "./character-data-class.js";

const addGetAppearance = nlp.plugin({
  api: (View) => {
    View.prototype.getAppearance = function () {
      // Body
      const bodyParts = new Describer("#BodyPart", this);

      // Bodytype
      const bodyType = new Describer("#BodyType", this);

      // Hair
      const hair = new Describer("#HairStyle", this);

      // Facial Hair
      const facialHair = new Describer("#FacialHair", this);

      // Clothing
      const clothing = new Describer("#Clothing", this);

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
