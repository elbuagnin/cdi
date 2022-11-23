function subTags(terms, subTagList) {
  const subTagsFound = [];
  terms.forEach((term) => {
    console.log(term);
    subTagList.forEach(subTag => {
      subTag = "#" + subTag;
      console.log(subTag);
      if (term.has(subTag)) {
        const obj = {
          "term": term.text(),
          "subtag": subTag
        };
        subTagsFound.push(obj);
      }
    })
  })
  return subTagsFound;
}

function itModifies (term, doc) {
  function hasModifierTag (term) {
    let foundTag= false;

    term.json(0).terms[0].tags.forEach(tag => {
      if (tag.substr(0,9) === "Modifies:") {
        console.log("here tag: " + tag);
        foundTag = tag.substr(9);
      }
    });

    return foundTag;
  }

  const modifiedTerms = [];
  const modifyingTag = hasModifierTag(term);
  console.log(modifyingTag);
  if (modifyingTag !== false) {
    const modifiedTerm = doc.match(modifyingTag);
    const obj = {"modified": modifiedTerm};
    modifiedTerms.push(obj);
  }
console.log(modifiedTerms);
  return modifiedTerms;
}

export {subTags, itModifies};