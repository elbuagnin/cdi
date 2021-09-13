const nlp = require('compromise');
const correctives = require('./tags-words/correctives');
const btags = require('./tags-words/base-tags');
const etags = require('./tags-words/environment-tags');
const gtags = require('./tags-words/genre-tags');
const bwords = require('./tags-words/base-words');
const ewords = require('./tags-words/environment-words.json');
const gwords = require('./tags-words/genre-words');
const swords = require('./tags-words/setting-words');
const allTags = Object.assign(btags, etags, gtags);
const allWords = Object.assign(correctives, bwords, ewords, gwords, swords);


module.exports = nlp.extend((Doc, world) => {
    const formatTag = function (tag) {
        let fTag = {};
        fTag = {isA: tag};
        return fTag;
    };

    Doc.prototype.loadCDITags = function() {
        let obj = {};
        Object.keys(allTags).forEach(k => {
            let tag = formatTag(allTags[k]);
            obj[k] = tag;
        });

        world.addTags(obj);
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
