'use strict';
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
const ntClass = require('./name/name-tagger');
const fsClass = require('./skills/find-skills');
require('./skills/find-skills');


module.exports = async function cdi(name, description) {
    var doc = nlp(description); // Natural Language Parser
    doc.contractions().expand(); // Expand Contractions
    new ntClass(name, doc); // Tag the name of the character
    fsClass(doc); // Determine the skillset of the character.



    const preppedDoc = {doc: doc};
    return (preppedDoc);
};
