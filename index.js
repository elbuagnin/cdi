'use strict';
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
const tagName = require('./names/tag-name');

module.exports = async function cdi(name, description) {
    var doc = nlp(description);
    doc.contractions().expand();

    const nameTags = await tagName(name);

    for (let tag in nameTags) {
        let word = doc.match(nameTags[tag]);
        word.tag(tag);

        // Add 'principal' tag to names.
        switch (tag) {
            case 'fullName':
                word.tag('Principal');
                break;
            case 'firstName':
                word.tag('Principal');
                break;
            case 'lastName':
                word.tag('Principal');
                break;
        }
    }

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
