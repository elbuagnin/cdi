function subTags(terms, subTagList) {
  const subTagsFound = [];
  terms.forEach((term) => {
    subTagList.forEach((subTag) => {
      subTag = "#" + subTag;
      if (term.has(subTag)) {
        const obj = {
          term: term.text(),
          subtag: subTag,
        };
        subTagsFound.push(obj);
      }
    });
  });
  return subTagsFound;
}

function itModifies(term, doc) {
  function hasModifierTag(term) {
    let foundTag = false;

    term.json(0).terms[0].tags.forEach((tag) => {
      if (tag.substr(0, 9) === "Modifies:") {
        foundTag = tag.substr(9);
      }
    });
    return foundTag;
  }

  const modifiedTerms = [];
  const modifyingTag = hasModifierTag(term);
  if (modifyingTag !== false) {
    const modifiedTerm = doc.match(modifyingTag);
    const obj = { modified: modifiedTerm };
    modifiedTerms.push(obj);
  }
  return modifiedTerms;
}

function isModifiedBy(term, doc) {
  const modifiers = [];
  if (term.has("#Verb")) {
    term.adverbs().forEach((adverb) => {
      modifiers.push(adverb);
    });
  }
  if (term.has("#Noun")) {
    term.adjectives().forEach((adjective) => {
      modifiers.push(adjective);
    });
  }
  doc.match("#Modifier").forEach((candidateTerm) => {
    const termTags = itModifies(candidateTerm, doc);
    termTags.forEach((termTag) => {
      if (termTag.modified.text() === term.text()) {
        modifiers.push(candidateTerm);
      }
    });
  });
  return modifiers;
}

function mergeDuplicates(rawList) {
  let returnList = [];

  rawList.forEach((listObj) => {
    const listItem = Object.values(listObj)[0];

    let indexOfListItem = returnList
      .map((obj) => Object.values(obj)[0])
      .indexOf(listItem);

    if (indexOfListItem === -1) {
      returnList.push(listObj);
    } else {
      let tempObj = returnList[indexOfListItem];
      let valueOfTmpObj = Object.values(tempObj)[1];
      let keyOfTmpObj = Object.keys(tempObj)[1];

      let valueOfNewObj = Object.values(listObj)[1];

      let combinedNewValue = [...valueOfTmpObj, ...valueOfNewObj];
      tempObj[keyOfTmpObj] = combinedNewValue;

      returnList[indexOfListItem] = tempObj;
    }
  });
  return returnList;
}

function addDescripters(objectToAddTo, itemToAddTo, objectToAdd) {
  console.log(JSON.stringify(objectToAddTo));
  let objectToAddToList = objectToAddTo.items.map((item) => item.bodypart);
  console.log(objectToAddToList);
  // const indexOfItemToAddTo = objectToAddToList.indexOf(itemToAddTo);
  // if (indexOfItemToAddTo > -1) {
  //   console.log("here here here");
  //   const orignialDescripters =
  //     objectToAddTo.items[indexOfItemToAddTo].descripters;
  //   console.log(orignialDescripters);
  //   const combinedDescripters = [...orignialDescripters, objectToAdd];
  //   objectToAddTo.items[indexOfItemToAddTo].descripters = combinedDescripters;
  // } else {
  //   const categoryName = Object.keys(objectToAddToList[0]);
  //   const newObj = { [categoryName]: objectToAdd };
  //   objectToAddTo.items[itemToAddTo] = newObj;
  //   console.log();
  // }
  // console.log(JSON.stringify(objectToAddTo));
}

function findItemsFromDoc(searchTag, categoryIndividualName, doc, allItems) {
  const rawItemList = [];
  const itemsNLPData = [];
  const itemTerms = doc.match(searchTag);

  itemTerms.forEach((itemTerm) => {
    let descripters = isModifiedBy(itemTerm, doc);
    if (descripters.length > 0 || allItems === true) {
      let nlpData = {
        [categoryIndividualName]: itemTerm,
        descripters: descripters,
      };
      itemsNLPData.push(nlpData);

      let itemData = {
        [categoryIndividualName]: itemTerm.text(),
        descripters: descripters.map((term) => term.text()),
      };
      rawItemList.push(itemData);
    }
  });

  const itemsList = mergeDuplicates(rawItemList);
  return { items: itemsList, nlpData: itemsNLPData };
}

function createEnglishTextList(items) {
  var text = "";
  const totalItems = items.lenth;

  items.forEach((item, i) => {
    if (i === 0) {
      text += item;
    }
    if (i < totalItems - 1 && i > 0) {
      text += ", " + item;
    }
    if (i === totalItems - 1 && totalItems > 2) {
      text += " and " + item;
    }
  });
  return text;
}

export {
  findItemsFromDoc,
  subTags,
  itModifies,
  isModifiedBy,
  mergeDuplicates,
  addDescripters,
  createEnglishTextList,
};
