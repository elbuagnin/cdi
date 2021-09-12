const nlp = require('compromise');
const btags = require('./base-tags');
const etags = require('./environment-tags');
const gtags = require('./genre-tags');
const gwords = require('./genre-words');
const swords = require('./setting-words');
const allTags = Object.assign(btags, etags, gtags);
const allWords = Object.assign(gwords, swords);


module.exports = nlp.extend((Doc, world) => {
    const formatTag = function (tag) {
        let fTag = {};
        fTag = {isA: tag};
        return fTag;
    };

    const addIn = function (allTags) {
        Object.keys(allTags).forEach(k => {
            let tag = formatTag(allTags[k]);
            let obj = {};
            obj[k] = tag;
            world.addTags(obj);
        });
    };

    Doc.prototype.loadCDITags = function() {
        addIn(allTags);
    };

    Doc.prototype.loadCDIWords = function() {
        for (let i in Object.keys(allWords)) {
            let key = Object.keys(allWords)[i];
            let value = Object.values(allWords)[i];
            let newWord = {};
            newWord[key] = value;

            world.addWords(newWord);
        }
    };
});
