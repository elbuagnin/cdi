import * as helper from "../lib/doc-helpers.js";

export class Describer {
  constructor(tag, doc, filter) {
    this.doc = doc;
    this.tag = tag;
    this.aspect = this.tag.substr(1).toLowerCase();
    this.nlpTerms = this.doc.match(this.tag);
    this.filter = filter;
  }

  allTerms() {
    const termObjList = this.nlpTerms.map((nlpTerm) => {
      const descripters = helper.isModifiedBy(nlpTerm, this.doc);
      const textualDescripters = descripters.map((descripter) =>
        descripter.text()
      );

      return { [this.aspect]: nlpTerm.text(), descripters: textualDescripters };
    });

    const mergedTermObjList = helper.mergeDuplicates(termObjList);
    
    return mergedTermObjList;
  }

  describedTermsOnly() {
    const termObjList = this.nlpTerms.map((nlpTerm) => {
      const descripters = helper.isModifiedBy(nlpTerm, this.doc);
      if (descripters.length > 0) {
        const textualDescripters = descripters.map((descripter) =>
          descripter.text()
        );
        return { [this.aspect]: nlpTerm.text(), descripters: textualDescripters };
      } else {
        return "";
      }
    });

    const filteredTermObjList = termObjList.filter(term => term != "");
    const mergedTermObjList = helper.mergeDuplicates(filteredTermObjList);

    return mergedTermObjList;
  }

  get terms() {
    if (this.filter === true) {
      return this.describedTermsOnly();
    } else {
      return this.allTerms();
    }
  }
}
