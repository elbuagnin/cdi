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
    term.json(0).terms.forEach(tag => {
      if (tag.substr(0,9) === "Modifies:") {
        console.log("here it is!!! => " + tag);
      }
    });
  }

  hasModifierTag(term);
}

export {subTags, itModifies};