export default function subTags(terms, subTagList) {
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
