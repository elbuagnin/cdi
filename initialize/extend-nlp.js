const nlp = require('compromise');

module.exports = nlp.extend((Doc, world) => {

    const formatTag = function (tag) {
        let fTag = {};
        fTag = {isA: tag};
        return fTag;
    };

    Doc.prototype.addCustomTags = function(tagData) {
        tagData.forEach(dataSet => {
            let obj = {};
            Object.keys(dataSet).forEach(k => {
                let tag = formatTag(dataSet[k]);
                obj[k] = tag;
            });

            world.addTags(obj);
        });
    };

    Doc.prototype.addCustomWords = function(wordData) {
        wordData.forEach(dataSet => {
            for (let i in Object.keys(dataSet)) {
                let key = Object.keys(dataSet)[i];
                let value = Object.values(dataSet)[i];
                let newWord = {};
                newWord[key] = value;

                world.addWords(newWord);
            }
        });
    };
});
