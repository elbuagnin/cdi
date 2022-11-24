import nlp from "compromise";
import { itModifies, isModifiedBy } from "../lib/doc-helpers.js";

const addGetAppearance = nlp.extend({
  api: (View) => {
    View.prototype.getAppearance = function () {
      const testTerm = this.match("grayish");
      const modified = itModifies(testTerm, this);

      //console.log(JSON.stringify(modified));

      const otherTestTerm = this.match("Flows");
      console.log(otherTestTerm);
      const modifiers = isModifiedBy(otherTestTerm, this);

      console.log(JSON.stringify(modifiers));
    };
  },
});

export default addGetAppearance;
