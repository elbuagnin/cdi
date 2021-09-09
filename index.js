'use strict';
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
const ntClass = require('./names/name-tagger');
const ssClass = require('./structure/sentence-structure');


module.exports = async function cdi(name, description) {
    var doc = nlp(description); // Natural Language Parser
    doc.contractions().expand(); // Expand Contractions
    new ntClass(name, doc); // Tag the name of the character
    const ss = new ssClass(doc); // Breakdown the document to sentences and clauses.
    const structure = ss.structure;

    console.log(JSON.stringify(structure));

    // // Start breaking down doc to sentences, clauses, and phrases.
    // var sentences = doc.sentences();
    // var subjects = '';
    // var clauses = '';
    //
    // for (let i = 0; i < sentences.length; i++) {
    //     subjects = sentences.subjects();
    //     clauses = sentences.clauses();
    // }

    const preppedDoc = {doc: doc, structure: structure};
    return (preppedDoc);
};
