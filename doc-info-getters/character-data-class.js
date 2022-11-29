import { update } from "lodash-es";
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

      return {
        [this.aspect]: nlpTerm.text(),
        descripters: textualDescripters,
        parts: [],
        contains: [],
      };
    });

    const mergedTermObjList = helper.mergeDuplicates(termObjList);

    return mergedTermObjList;
  }

  describedTermsOnly() {
    return this.inventory.filter((term) => {
      return term.descripters.length > 0 || term.parts.length > 0 || term.contains.length > 0;
    });
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
      this.addDetails(objToAdd[this.aspect], objToAdd.descripters);
    } else {
      this.inventory.push(objToAdd);
    }
  }

  addDetails(editItem, details, type) {
    console.log("Adding details of " + editItem);
    let detailsArray = [];

    if (["descripters", "parts", "contains"].indexOf(type) === -1) {
      type = "descripters";
    }

    if (Array.isArray(details)) {
      detailsArray = details;
    } else {
      if (typeof details === "string") {
        detailsArray.push(details);
      }
    }

    const index = this.findIndexOf(editItem);
    console.log("index of found terms s " + index);
    if (index > -1) {
      console.log("updating details of " + editItem);
      var updatedDetails = "";

      switch (type) {
        case "descripters":
          updatedDetails =
            this.inventory[index].descripters.concat(detailsArray);
          this.inventory[index].descripters = updatedDetails;
          break;
        case "parts":
          updatedDetails = this.inventory[index].parts.concat(detailsArray);
          this.inventory[index].parts = updatedDetails;
          break;
        case "contains":
          updatedDetails = this.inventory[index].contains.concat(detailsArray);
          this.inventory[index].contains = updatedDetails;
          break;
        default:
          updatedDetails =
            this.inventory[index].descripters.concat(detailsArray);
          break;
      }
    } else {
      console.log("Creating new object for " + editItem);
      const newItemObj = {
        [this.aspect]: editItem,
        descripters: [],
        parts: [],
        contains: [],
      };
      console.log(newItemObj);
      newItemObj[type] = updatedDetails;
      console.log(newItemObj[type]);
      console.log(newItemObj);
      this.inventory.push(newItemObj);
    }

    return true;
  }
}
