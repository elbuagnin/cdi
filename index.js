'use strict';
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
const tagName = require('./names/name-tagger');

module.exports = async function cdi(name, description) {
    var doc = nlp(description);
    doc.contractions().expand();

    let tn = new tagName(name);
    const nameTags = tn.nameTags();

    for (let tag in nameTags) {
        console.log('Tag, You are it: ' + JSON.stringify(nameTags[tag]));
        let word = doc.match(nameTags[tag]);
        console.log('Word up: ' + JSON.stringify(word));
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
