import grandiloquent from 'grandiloquent';
import nlp from 'compromise';
import _ from 'lodash-es';
import nlpTagName from '../lib/nlp-name-tagger.js';

export default class Grammar {
    constructor (text, name) {
        this.name = name;
        this.nameTags = {};
        this.original = text;
        this.doc = nlp(text);
        this.paragraph = grandiloquent.paragraph(text);
        this.sentence = grandiloquent.sentence(text);
    }

    tagCharacterName () {
        this.nameTags = nlpTagName(this.doc, this.name);
    }

    getSentences () {
        let sentences = [];
        this.paragraph.sentences.forEach (sentence => {
            sentence = String(sentence);
            sentences.push(sentence);
        });

        return sentences;
    }

    isCompleteSentence () {
        if (this.getMainClause()) {
            return true;
        } else {
            return false;
        }
    }

    getSubject () {
        let subject = this.sentence.getSubjectPhrase();
        if (subject) {
            if (this.verifyHasNoun(subject) === true ) {
                let prepositionalPhrases = this.getPrepositionalPhrases();
                if (prepositionalPhrases) {
                    subject = this.removePhrases(prepositionalPhrases, subject);
                }
                return subject;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    getMainVerb () {
        let mainVerb = this.sentence.getMainVerb();
        if (mainVerb) {
            let nlpVerb = nlp(mainVerb.toString());
            if (nlpVerb.canBe('#Verb').found === false) {
                return false;
            }
            if (nlpVerb.match('#Gerund').text()) {
                if (nlpVerb.match('#Copula #Determiner? #Adverb?+ #Adjective?+ #Gerund').found === false ) {
                    return false;
                }
            }
            return mainVerb.toString();
        } else {
            return false;
        }
    }

    getMainClause () {
        let mainClause = this.sentence.getSubjectVerbPhrase();
        if (mainClause.input !== '') {
            if (this.getMainVerb() && this.getSubject()) {
                return mainClause.toString();
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    getPrepositionalPhrases () {
        let prepositions = this.doc.prepositions().json().map(o=>o.text);
        let phrases = [];

        prepositions.forEach (preposition => {
            let currentMatch = this.doc.match(preposition).lookAhead('#Noun').matchOne('#Noun');
            let endPhrase = currentMatch.text();

            while (currentMatch !== false) {
                let nextTerm = this.doc.match(currentMatch).lookAhead('.').matchOne('.');
                if (nextTerm.match('#Noun').found) {
                    currentMatch = nextTerm;
                    endPhrase += ' ' + nextTerm.text();
                } else if (nextTerm.match('#Conjunction').found) {
                    let nextNextTerm = nextTerm.lookAhead('.').matchOne('.');
                    if (nextNextTerm.nouns().found) {
                        currentMatch = nextTerm;
                        endPhrase += ' ' + nextTerm.text();
                    } else {
                        if (currentMatch.match('#Pronoun').found) {
                            //endPhrase = endPhrase.replace(currentMatch.text(), '');
                        }
                        currentMatch = false;
                    }
                } else {
                    if (currentMatch.match('#Pronoun').found) {
                        endPhrase = endPhrase.replace(currentMatch.text(), '');
                    }
                    currentMatch = false;
                }
            }

            let prepPhrase = this.doc.matchOne(preposition + ' * ' + endPhrase).text();
            phrases.push(prepPhrase);
        });

        phrases = _.uniq(phrases);
        console.log('Preposition Phrases: ' + JSON.stringify(phrases));
        return phrases;
    }

    // Internal helpers
    isType (text) {
        let type = text.constructor.name;
        if (type === 'Sentence') { return 'glp'; }
        if (type.substr(0,4) === 'Doc$') { return 'nlp'; }
        if (Array.isArray(text) === true) { return 'array'; }

        return typeof text;
    }

    textToString (text) {
        let string = '';

        switch (this.isType(text)) {
        case 'glp':
            string = text.toString();
            break;
        case 'nlp':
            string = text.text();
            break;
        case 'string':
            string = text;
            break;
        default:
            throw new Error('Wrong data type for `text`. Expecting type nlp, glp, or string.');
        }

        return string;
    }

    glpToNlp (glpText) {
        if (this.isType(glpText) === 'glp') {
            let text = glpText.toString();
            return nlp(text);
        } else {
            throw new Error('Wrong variable type. Expecting type glp'); // fixme
        }
    }

    nlpToGlp (nlpText) {
        if (this.isType(nlpText) === 'nlp') {
            let text = nlpText.text();
            return this.glp.sentence(text);
        } else {
            throw new Error('Wrong variable type. Expecting type nlp');
        }
    }

    verifyHasNoun (text) {
        text = this.textToString(text);

        if (nlp(text).nouns().found === true) {
            return true;
        } else {
            return false;
        }
    }

    removePhrases (phrases, text) {
        if (this.isType(phrases) !== 'array') {
            phrases = [phrases];
        }

        phrases.forEach (phrase => {
            text = this.textToString(text);
            phrase = this.textToString(phrase);
            text = text.replace(phrase, '');
        });

        text = this.trimAll (text);
        return text;
    }

    trimAll (text) {
        if (typeof text !== 'string') {
            text = this.textToString(text);
        }

        let regex = /\s+/g;
        text = text.replace(regex, ' ');

        regex = / (\W)/g;
        text = text.replace(regex, '$1');

        regex = /(?:\.|,|!|\?)$/g;
        text = text.replace(regex, '');

        return text.trim();
    }
}
