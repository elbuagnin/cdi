import nlp from "compromise";
import { itModifies } from "../lib/doc-helpers.js";

const addGetAppearance = nlp.extend({
    api: (View) => {
        View.prototype.getAppearance = function () {

            const testTerm = this.match("grayish");
            const modified = itModifies(testTerm, this);

            console.log(JSON.stringify(modified))
        }
    }
});

export default addGetAppearance;