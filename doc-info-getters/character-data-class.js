import * as helper from "../lib/doc-helpers.js";

export class Describer {
  constructor(tag, doc) {
    this.doc = doc;
    this.tag = tag;
    this.aspect = this.tag.substr(1).toLowerCase();
    this.nlpTerms = this.doc.match(this.tag);
  }

  describedTerms() {
    const termObjList = this.nlpTerms.map((nlpTerm) => {
      const descripters = helper.isModifiedBy(nlpTerm, this.doc);
      const textualDescripters = descripters.map((descripter) =>
        descripter.text()
      );

      return { [this.aspect]: nlpTerm.text(), descripters: textualDescripters };
    });

    return helper.mergeDuplicates(termObjList);
  }

  get terms() {
    return this.describedTerms();
  }
}
