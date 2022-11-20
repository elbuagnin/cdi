import nlp from "compromise";

nlp.plugin({
  api: (View) => {
    (View.prototype.addCustomTags = function (tagData) {
      function formatTag(tag) {
        let fTag = {};
        fTag = { isA: tag };
        return fTag;
      }

      tagData.forEach((dataSet) => {
        let obj = {};
        Object.keys(dataSet).forEach((k) => {
          let tag = formatTag(dataSet[k]);
          obj[k] = tag;
        });

        nlp.addTags(obj);
      });
    }),
      (View.prototype.addCustomWords = function (wordData) {
        wordData.forEach((dataSet) => {
          for (let i in Object.keys(dataSet)) {
            let key = Object.keys(dataSet)[i];
            let value = Object.values(dataSet)[i];
            let newWord = {};
            newWord[key] = value;

            nlp.addWords(newWord);
          }
        });
      });
  },
});
