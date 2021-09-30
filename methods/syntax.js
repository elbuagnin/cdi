import nlp from 'compromise';

nlp.extend((Doc, world) => { // eslint-disable-line

    Doc.prototype.nounPhrase = function () {
        let gerunds = this.match('#Gerund');

        return gerunds;
    };


    Doc.prototype.subject = function () {
        let syntax = this.match('[<subject>#Noun] * #Verb').groups();
        return syntax.subject;
    };

    Doc.prototype.compoundClauses = function () {

        let compoundClauses = undefined;

        // Steely Dan groove ... [ ,and ] ... they groove with style.
        let conjunction = this.match('#Conjunction');
        if (conjunction.found) {
            if (conjunction.justBefore().has('@hasComma')) {
                compoundClauses = this.match(conjunction).split();
                compoundClauses.lastTerms().first().delete();
            }
        }

        // Pink Floyd is a band ... [ ; ] ... they are not a guy.
        if (this.match('@hasSemicolon').found) {
            console.log('hasSemiColon');
            compoundClauses = this.match('@hasSemicolon').split();
        }

        if (compoundClauses) {
            return compoundClauses;
        } else {
            return false;
        }
    };

    Doc.prototype.prepositionPhrases = function () {
        let prepositions = this.prepositions().json().map(o=>o.text);
        let phrases = [];

        prepositions.forEach (preposition => {
            let currentMatch = this.match(preposition).lookAhead('#Noun').matchOne('#Noun');
            let endPhrase = currentMatch.text();

            while (currentMatch !== false) {
                let nextTerm = this.match(currentMatch).justAfter();
                if (nextTerm.match('#Noun').found) {
                    currentMatch = nextTerm;
                    endPhrase += ' ' + nextTerm.text();
                } else if (nextTerm.match('#Conjunction').found) {
                    let nextNextTerm = nextTerm.justAfter();
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

            let prepPhrase = this.matchOne(preposition + ' * ' + endPhrase).text();
            phrases.push(prepPhrase);
        });
    };

    Doc.prototype.justBefore = function () {

        let precedingWords = this.parent().before(this);
        let precedingWord = precedingWords.lastTerms();
        return precedingWord;
        // return this.parent().lookBehind('.').matchOne('.');
    };

    Doc.prototype.justAfter = function () {

        let succeedingWords = this.parent().after(this);
        let succeedingWord = succeedingWords.firstTerms();

        return succeedingWord;
    };



});

//
// export default class Grammar extends nlp {
//     // Public Methods
//     isCompleteSentence () {
//         if (this.getMainClause()) {
//             return true;
//         } else {
//             return false;
//         }
//     }
//
//     subject () {
//         let subject = 'Subject Test.';//this.subjects();
//         // if (subject) {
//         //     if (this.verifyHasNoun(subject) === true ) {
//         //         let prepositionalPhrases = this.getPrepositionalPhrases();
//         //         if (prepositionalPhrases) {
//         //             subject = this.removePhrases(prepositionalPhrases, subject);
//         //         }
//         //         return subject;
//         //     } else {
//         //         return false;
//         //     }
//         // } else {
//         //     return false;
//         // }
//         return subject;
//     }
//
//     getMainVerb () {
//         let mainVerb = this.sentence.getMainVerb();
//         if (mainVerb) {
//             let nlpVerb = nlp(mainVerb.toString());
//             if (nlpVerb.canBe('#Verb').found === false) {
//                 return false;
//             }
//             if (nlpVerb.match('#Gerund').text()) {
//                 if (nlpVerb.match('#Copula #Determiner? #Adverb?+ #Adjective?+ #Gerund').found === false ) {
//                     return false;
//                 }
//             }
//             return mainVerb.toString();
//         } else {
//             return false;
//         }
//     }
//
//     getMainClause () {
//         let mainClause = this.sentence.getSubjectVerbPhrase();
//         if (mainClause.input !== '') {
//             if (this.getMainVerb() && this.getSubject()) {
//                 return mainClause.toString();
//             } else {
//                 return false;
//             }
//         } else {
//             return false;
//         }
//     }
//

//
//         phrases = _.uniq(phrases);
//         console.log('Preposition Phrases: ' + JSON.stringify(phrases));
//         return phrases;
//     }
//
//     // Internal helpers
//     isType (text) {
//         let type = text.constructor.name;
//         if (type === 'Sentence') { return 'glp'; }
//         if (type.substr(0,4) === 'Doc$') { return 'nlp'; }
//         if (Array.isArray(text) === true) { return 'array'; }
//
//         return typeof text;
//     }
//
//     textToString (text) {
//         let string = '';
//
//         switch (this.isType(text)) {
//         case 'glp':
//             string = text.toString();
//             break;
//         case 'nlp':
//             string = text.text();
//             break;
//         case 'string':
//             string = text;
//             break;
//         default:
//             throw new Error('Wrong data type for `text`. Expecting type nlp, glp, or string.');
//         }
//
//         return string;
//     }
//
//     glpToNlp (glpText) {
//         if (this.isType(glpText) === 'glp') {
//             let text = glpText.toString();
//             return nlp(text);
//         } else {
//             throw new Error('Wrong variable type. Expecting type glp'); // fixme
//         }
//     }
//
//     nlpToGlp (nlpText) {
//         if (this.isType(nlpText) === 'nlp') {
//             let text = nlpText.text();
//             return this.glp.sentence(text);
//         } else {
//             throw new Error('Wrong variable type. Expecting type nlp');
//         }
//     }
//
//     verifyHasNoun (text) {
//         text = this.textToString(text);
//
//         if (nlp(text).nouns().found === true) {
//             return true;
//         } else {
//             return false;
//         }
//     }
//
//     removePhrases (phrases, text) {
//         if (this.isType(phrases) !== 'array') {
//             phrases = [phrases];
//         }
//
//         phrases.forEach (phrase => {
//             text = this.textToString(text);
//             phrase = this.textToString(phrase);
//             text = text.replace(phrase, '');
//         });
//
//         text = this.trimAll (text);
//         return text;
//     }
//
//     trimAll (text) {
//         if (typeof text !== 'string') {
//             text = this.textToString(text);
//         }
//
//         let regex = /\s+/g;
//         text = text.replace(regex, ' ');
//
//         regex = / (\W)/g;
//         text = text.replace(regex, '$1');
//
//         regex = /(?:\.|,|!|\?)$/g;
//         text = text.replace(regex, '');
//
//         return text.trim();
//     }
// }
