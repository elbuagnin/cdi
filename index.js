'use strict';
global._ = require('lodash');
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
require('./initialize/load-tags');
const ntClass = require('./name/name-tagger');
const pdClass = require('./parser/parse-descriptions.js');

module.exports = function cdi(name, description) {
    var cdi = nlp(''); // prime nlp so we can load our custom tags and words.
    cdi.loadCDITags();
    cdi.loadCDIWords();
    var doc = nlp(description); // Natural Language Parser
    doc.contractions().expand();
    new ntClass(name, doc); // Tag the name of the character
    console.log('\x1b[1m', '\x1b[34m', '\n\n####################\n',name, '\n', '\x1b[0m');
    pdClass(doc); // Parse the character description.



    const preppedDoc = {doc: doc};
    return (preppedDoc);
};
