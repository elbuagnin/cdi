'use strict';
global._ = require('lodash');
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
require('./initialize/load-tags');
const ntClass = require('./name/name-tagger');
const pdClass = require('./parser/parse-descriptions.js');

module.exports = async function cdi(name, description) {
    var doc = nlp(description); // Natural Language Parser
    await doc.loadCDITags();
    await doc.loadCDIWords();
    doc.contractions().expand(); // Expand Contractions
    await new ntClass(name, doc); // Tag the name of the character
    console.log('\x1b[1m', '\x1b[34m', '\n\n####################\n',name, '\n', '\x1b[0m');
    pdClass(doc); // Parse the character description.



    const preppedDoc = {doc: doc};
    return (preppedDoc);
};
