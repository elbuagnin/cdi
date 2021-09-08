'use strict';
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
const ntClass = require('./names/name-tagger');

module.exports = async function cdi(name, description) {
    var doc = nlp(description);
    doc.contractions().expand();

    const nt = new ntClass(name, doc);

    // Start breaking down doc to sentences, clauses, and phrases.
    var sentences = doc.sentences();
    var subjects = '';
    var clauses = '';

    for (let i = 0; i < sentences.length; i++) {
        subjects = sentences.subjects();
        clauses = sentences.clauses();
    }

    const preppedDoc = {doc: doc, sentences: sentences, clauses: clauses, subjects: subjects};
    return (preppedDoc);
};
