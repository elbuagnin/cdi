const nlp = require('compromise');
const correctives = require('./tags-words/correctives');
const btags = require('./tags-words/base-tags');
const etags = require('./tags-words/environment-tags');
const gtags = require('./tags-words/genre-tags');
const bwords = require('./tags-words/base-words');
const ewords = require('./tags-words/environment-words');
const gwords = require('./tags-words/genre-words');
const swords = require('./tags-words/setting-words');
const colors = require('./tags-words/base-words/colors');
const units = require('./tags-words/base-words/units');
const bodytypes = require('./tags-words/base-words/body-types');
const sneakywords = require('./tags-words/archetype-words/sneaky-words');

const allTagData = [correctives, btags, etags, gtags];
const allWordData = [bwords, ewords, gwords, swords, colors, units, bodytypes, sneakywords];

module.exports = nlp.extend((Doc, world) => {

    const formatTag = function (tag) {
        let fTag = {};
        fTag = {isA: tag};
        return fTag;
    };

    Doc.prototype.loadCDITags = function() {
        //let allTags = loadTagData();
        allTagData.forEach(dataSet => {
            let obj = {};
            Object.keys(dataSet).forEach(k => {
                let tag = formatTag(dataSet[k]);
                obj[k] = tag;
            });

            world.addTags(obj);
        });
    };

    Doc.prototype.loadCDIWords = function() {
        //let allWords = loadWordData();
        allWordData.forEach(dataSet => {
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
