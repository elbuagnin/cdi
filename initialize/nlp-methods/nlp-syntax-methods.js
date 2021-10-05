import nlp from 'compromise';

// const nothing = '';

nlp.extend((Doc, world) => { // eslint-disable-line

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

    Doc.prototype.verbPhrases = function () {
        //
    };

    Doc.prototype.nounPhrases = function () {
        // the shiny, red automobile
        // multiple, head-scratching mysteries

        /* Development Options */
            let devBlockName = 'nounPhrases'; // eslint-disable-line
            let devInfoOn = false; // eslint-disable-line
            devBlock('nounPhrases', devInfoOn);  // eslint-disable-line
        /***********************/

        let sentence = this;
        let phrases = [];
        let strPhrases = [];

        // Find all nouns.
        let nouns = sentence.match('#Noun').reverse(); // Do .match('#Noun') instead of .nouns to include pronouns.

        // Looking for potential head nouns of noun phrases.
        // If they can form a phrase, they are the head of a noun phrase.
        nouns.forEach(noun => {
            let nounPhrase = sentence.phraseBackward(noun, [{tag: '#Verb', include: false}]);
            phrases.push(nounPhrase);
        });

        strPhrases = phrases.NlpArrayToString();
        strPhrases = strPhrases.noSubDupes();

        // Convert back to NLP, tag 'em and bag 'em.
        strPhrases.reverse();
        let nounPhrases = strPhrases.stringArrayToNlp(sentence);

        // Remove prepositional phrases
        nounPhrases = nounPhrases.map((phrase, i) => {
           devInfo(phrase, 'phrase', devInfoOn, devBlockName); // eslint-disable-line
            if (phrase.prepositions().found) {
                let prepositions = phrase.prepositions();
                let updatedPhrase = {};
                prepositions.forEach(preposition => {
                    let prepPhrase = phrase.phraseForward(preposition, [{tag: '#Noun', include: true}]);
                    updatedPhrase = phrase.remove(prepPhrase);
                    if (updatedPhrase.wordCount() === 1) {
                        console.log('i = ' + i);
                        console.log('deleting ' + nounPhrases[i]);
                        updatedPhrase = '';
                    }
                });

                return updatedPhrase;
            } else {
                return phrase;
            }
        });

        sentence.syntaxTag(nounPhrases, 'NounPhrase');

        return nounPhrases;
    };

    Doc.prototype.prepositionalPhrases = function () {
        // over the moon
        // in Cherry Hill Lane
        // of the turning away

        /* Development Options */
        let devBlockName = 'prepositionalPhrases'; // eslint-disable-line
        let devInfoOn = false; // eslint-disable-line
        devBlock('prepositionalPhrases', devInfoOn); // eslint-disable-line
        /***********************/
        let sentence = this;
        let phrases = [];
        let strPhrases = [];

        // Find preprosition words.
        let prepositions = sentence.prepositions().reverse();

        // Search forward fo the noun that ends the prepositional phrase.
        // @example: for [country] and [honor]
        // @example: of the [people]
        prepositions.forEach (preposition => {
            let prepPhrase = sentence.phraseForward(preposition, [{tag: '#Noun', include: true}]);
            phrases.push(prepPhrase);
            strPhrases = phrases.NlpArrayToString();
            strPhrases = strPhrases.noSubDupes();
        });

        // Convert back to NLP, tag 'em and bag 'em.
        strPhrases.reverse();
        let prepositionalPhrases = strPhrases.stringArrayToNlp(sentence);
        sentence.syntaxTag(prepositionalPhrases, 'PrepositionalPhrase');

        return prepositionalPhrases;
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
