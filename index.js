'use strict';
global._ = require('lodash');
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
require('./initialize/load-data');
const ntClass = require('./name/name-tagger');
const pdClass = require('./parser/parse-descriptions');
const statUpCharacter = require('./stats/statup-character');

module.exports = function cdi(name, description) {

    //var doc = nlp(description); // Natural Language Parser
    //doc.contractions().expand();
    //new ntClass(name, doc); // Tag the name of the character
    console.log('\x1b[1m', '\x1b[34m', '\n\n####################\n',name, '\n', '\x1b[0m');
    pdClass(description)
        .then(results => {
            statUpCharacter (results);
        });



    // const preppedDoc = {doc: doc};
    // return (preppedDoc);
};
