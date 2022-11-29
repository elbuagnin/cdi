import * as helper from "../lib/doc-helpers.js";

export class Describer {
  inventory;

  constructor(tag, doc, filter) {
    this.doc = doc;
    this.tag = tag;
    this.filter = filter;

    this.aspect = this.tag.substr(1).toLowerCase();
    this.foundNLPTerms = this.doc.match(this.tag);

    this.inventory = this.allTerms();
  }

  allTerms() {
    const termObjList = this.foundNLPTerms.map((nlpTerm) => {
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
    return this.inventory.filter((term) => term.descripters.length > 0);
  }

  get terms() {
    if (this.filter === true) {
      return this.describedTermsOnly();
    } else {
      return this.inventory;
    }
  }

  find(searchTerm) {
    const foundItem = this.inventory.find((item) => {
      return item[this.aspect] === searchTerm;
    });

    if (foundItem) {
      return foundItem;
    } else {
      return false;
    }
  }

  findIndexOf(searchTerm) {
    var index = -1;
    this.inventory.forEach((item, key) => {
      if (item[this.aspect] === searchTerm) {
        index = key;
      }
    });

    return index;
  }

  addItem(addedItem) {
    const addedItemKey = Object.keys(addedItem)[0];
    let objToAdd = {};

    if (addedItemKey != this.aspect) {
      objToAdd = {
        [this.aspect]: addedItem[addedItemKey],
        descripters: addedItem.descripters,
      };
    }
    
    const isItAlreadyAnEntry = this.find(objToAdd[this.aspect]);
    
    if (isItAlreadyAnEntry != false) {
      this.addDescripter(objToAdd[this.aspect], objToAdd.descripters);
    } else {
      this.inventory.push(objToAdd);
    }
  }

  addDescripter(editItem, descripter) {
    let descriptersArray = [];

    if (Array.isArray(descripter)) {
      descriptersArray = descripter;
    } else {
      if (typeof descripter === "string") {
        descriptersArray.push(descripter);
      }
    }

    const index = this.findIndexOf(editItem);

    if (index > -1) {
      const updatedDescripters =
        this.inventory[index].descripters.concat(descriptersArray);

      this.inventory[index].descripters = updatedDescripters;
    } else {
      const newItemObj = {
        [this.aspect]: editItem,
        descripters: descriptersArray,
      };

      this.addItem(newItemObj);
    }

    return true;
  }
}
