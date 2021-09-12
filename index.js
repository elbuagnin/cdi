'use strict';
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
//nlp.extend(require('./initialize/load-tags'));
require('./initialize/load-tags');
const ntClass = require('./name/name-tagger');
const fsClass = require('./skills/find-skills');

module.exports = async function cdi(name, description) {
    var doc = nlp(description); // Natural Language Parser
    doc.loadCDITags();
    doc.loadCDIWords();
    doc.contractions().expand(); // Expand Contractions
    new ntClass(name, doc); // Tag the name of the character
    console.log('\x1b[1m', '\x1b[33m', '\n\n####################\n',name, '\n', '\x1b[0m');
    fsClass(doc); // Determine the skillset of the character.



    const preppedDoc = {doc: doc};
    return (preppedDoc);
};
