import nlp from 'compromise';
// import _ from 'lodash-es';

nlp.extend((Doc, world) => { // eslint-disable-line

    world.addTags({
        Clause: {
            isA: '',
            notA: 'Phrase'
        },
        Phrase: {
            isA: '',
            notA: 'Clause',
        },
        NounPhrase: {
            isA: 'Phrase',
            notA: 'VerbPhrase'
        },
        PrepositionalPhrase: {
            isA: 'Phrase',
        }
    });

    Doc.prototype.nounPhrases = function () {
        // Call prepositionalPhrases() before looking for nounPhrases.

        /* Development Options */
        let devBlockName = 'nounPhrases';
        let devInfoOn = true;
        devBlock('nounPhrases', devInfoOn);  // eslint-disable-line
        /***********************/

        let copy = this.clone();
        let phrases = [];

        // Find all nouns.
        let nouns = copy.match('#Noun && !#PrepositionalPhrase').reverse();
        devInfo(nouns, 'nouns', devInfoOn, devBlockName); // eslint-disable-line

        // Looking for potential head nouns of noun phrases.
        nouns.forEach(noun => {
            let nounPhrase = noun.phraseBackwardTo('#Verb');
            devInfo(nounPhrase, 'nounPhrase', devInfoOn, devBlockName); // eslint-disable-line
            phrases.push(nounPhrase);

            devInfo(phrases, 'phrases before', devInfoOn, devBlockName); // eslint-disable-line
            // Eliminate phrases that are subphrases of other choices.
            phrases.forEach((phrase, i) => {
                //console.log(term.fg.blue + phrase); // eslint-disable-line
                for (let j = 0; j < i; j++) {
                    //console.log(term.fg.green + phrases[j]); // eslint-disable-line
                    if (phrases[j].indexOf(phrases[i]) === 0) {
                        //console.log(term.fg.red + phrases[i]); // eslint-disable-line
                        phrases.splice(i, 1);
                    }
                }
            });
            devInfo(phrases, 'phrases after', devInfoOn, devBlockName); // eslint-disable-line

        });

        phrases.reverse();
        devInfo(phrases, 'phrases final', devInfoOn, devBlockName); // eslint-disable-line
        let nounPhrases = stringArrayToNlp(copy, phrases);
        this.syntaxTag(nounPhrases, 'NounPhrase');
        devInfo(nounPhrases, 'Returing nounPhrases', devInfoOn, devBlockName); // eslint-disable-line
        return nounPhrases;

        devBlockOver('nounPhrases'); // eslint-disable-line
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

    Doc.prototype.prepositionalPhrases = function () {
        /* Development Options */
        let devBlockName = 'prepositionalPhrases'; // eslint-disable-line
        let devInfoOn = false; // eslint-disable-line
        devBlock('prepositionalPhrases', devInfoOn); // eslint-disable-line
        /***********************/

        let copy = this.clone();
        let phrases = [];

        // Find preprosition words.
        let prepositions = copy.prepositions().reverse();

        // Search forward fo the noun that ends the prepositional phrase.
        prepositions.forEach (preposition => {
            devInfo(preposition, 'preposition', true); // eslint-disable-line
            let prepPhrase = preposition.phraseForwardTo('#Noun', '#Conjunction', '#Pronoun');
            //let prepPhrase = copy.matchOne(preposition + ' * ' + endPhrase).text();
            phrases.push(prepPhrase);
        });

        let prepositionalPhrases = stringArrayToNlp(copy, phrases);
        this.syntaxTag(prepositionalPhrases, 'PrepositionalPhrase');
        return prepositionalPhrases;

        devBlockOver('prepositionalPhrases'); // eslint-disable-line
    };

    Doc.prototype.justBefore = function () {
        /* Development Options */
      let devBlockName = 'justBefore'; // eslint-disable-line
      let devInfoOn = true; // eslint-disable-line
      devBlock('justBefore', devInfoOn); // eslint-disable-line
        /***********************/

      devInfo(this.parent(), 'this.parent()', devInfoOn, devBlockName); // eslint-disable-line
        let precedingWords = this.parent().before(this);
        let precedingWord = precedingWords.lastTerms();
        devInfo(precedingWords, 'precedingWords', devInfoOn, devBlockName); // eslint-disable-line
        devInfo(precedingWord, 'precedingWord', devInfoOn, devBlockName); // eslint-disable-line
        if (precedingWord.found) {
            return precedingWord;
        } else return this.match('');

        devBlockOver('justBefore'); // eslint-disable-line
    };

    Doc.prototype.justAfter = function () {
        /* Development Options */
      let devBlockName = 'justAfter'; // eslint-disable-line
      let devInfoOn = true; // eslint-disable-line
      devBlock('justAfter', devInfoOn); // eslint-disable-line
        /***********************/
        devInfo(this.parent(), 'this.parent()', devInfoOn, devBlockName); // eslint-disable-line
        let succeedingWords = this.parent().after(this);
        devInfo(succeedingWords, 'succeedingWords', devInfoOn, devBlockName); // eslint-disable-line
        let succeedingWord = succeedingWords.firstTerms();
        devInfo(succeedingWord, 'succeedingWord', devInfoOn, devBlockName); // eslint-disable-line

        if (succeedingWord.found) {
            return succeedingWord;
        } else return this.match('');

        devBlockOver('justAfter'); // eslint-disable-line
    };

    // Private Helpers

    Doc.prototype.phraseBackwardTo = function (tail) {
        /* Development Options */
      let devBlockName = 'phraseBackwardTo'; // eslint-disable-line
      let devInfoOn = true; // eslint-disable-line
      devBlock('phraseBackwardTo()', devInfoOn); // eslint-disable-line
        /***********************/

        let phrase = this.text();
        devInfo(phrase, 'phrase', devInfoOn, devBlockName); // eslint-disable-line
        let currentMatch = this;
        devInfo(currentMatch, 'currentMatch', devInfoOn, devBlockName); // eslint-disable-line
        while(currentMatch !== false) {
            let preceedingTerm = this.match(currentMatch).justBefore();
            devInfo(preceedingTerm, 'preceedingTerm', devInfoOn, devBlockName); // eslint-disable-line
            if (preceedingTerm.not(tail).found) {
                currentMatch = preceedingTerm;
                phrase = currentMatch.text() + ' ' + phrase;
            } else {
                currentMatch = false;
            }
        }

        devBlockOver('phraseBackwardTo'); // eslint-disable-line
    };

    Doc.prototype.phraseForwardTo = function (tail, keepGoing = '', goneToFar = '') {
        let phrase = this.text();
        devInfo(phrase, 'arg', true, 'phraseForwardTo'); // eslint-disable-line
        let currentMatch = this;
        devInfo(currentMatch, 'currentMatch', true, 'phraseForwardTo'); // eslint-disable-line
        while(currentMatch !== false) {
            let succeedingTerm = currentMatch.justAfter();
            devInfo(succeedingTerm, 'succeedingTerm', true, 'phraseForwardTo'); // eslint-disable-line
            if (succeedingTerm.not(tail).found) {
                currentMatch = succeedingTerm;
                phrase = phrase + ' ' + currentMatch.text();
            } else {
                currentMatch = false;
            }
            if (succeedingTerm.match(goneToFar).found) {
                phrase = phrase.substring(phrase.indexOf(goneToFar), phrase.lastIndexOf(goneToFar));
            }
        }

        devBlockOver('phraseForwardTo'); // eslint-disable-line
    };

    // Generates unique IDs for by Tag.
    const tagIDs = {};
    function* generateID (tag) {
        /* Development Options */
      let devBlockName = 'generateID'; // eslint-disable-line
      let devInfoOn = true; // eslint-disable-line
      devBlock('generateID', devInfoOn); // eslint-disable-line
        /***********************/

        if (tag in tagIDs) {
            tagIDs[tag]++;
        } else {
            tagIDs[tag] = 0;
        }
        devInfo(tagIDs, 'tagIDs', devInfoOn, devBlockName); // eslint-disable-line
        yield tag + tagIDs[tag];

        devBlockOver('generateID'); // eslint-disable-line
    }

    Doc.prototype.syntaxTag = function (segments, tag) {
        if (!segments) return;

        segments.forEach (item => {
            // Tag with syntax tag and unique id.
            let id = generateID(tag).next().value;

            // Tag original sentence.
            this.match(item.text()).tag(tag);
            this.match(item.text()).tag(id);
            // Tag segment copies sent in args.
            item.tag(tag);
            item.tag(id);
        });
    };

    function stringArrayToNlp (doc, arrayOfStrings) {
        /* Development Options */
        let devBlockName = 'stringArrayToNlp';
        let devInfoOn = false;
        devBlock('stringArrayToNlp', devInfoOn, devBlockName); // eslint-disable-line
        /***********************/

        devInfo(arrayOfStrings, 'Incomming arrayOfStrings', devInfoOn, devBlockName); // eslint-disable-line

        if (arrayOfStrings.length === 0) return;

        // Let's not splice up the original.
        let copy = doc.clone();

        // Split up the strings.
        arrayOfStrings.forEach(string => {
            devInfo(string, 'string to split on', devInfoOn, devBlockName); // eslint-disable-line
            copy = copy.splitBefore(string);
            copy = copy.splitAfter(string);
        });

        devInfo(copy.length, 'copy.length', devInfoOn, devBlockName); // eslint-disable-line
        const indices = [];
        devInfo(indices, 'indices', devInfoOn, devBlockName); // eslint-disable-line
        copy.forEach((segment, index) => {
            arrayOfStrings.forEach(string => {
                if (segment.has(string)) {
                    indices.push(index);
                }
            });
        });

        const remove = [];
        for (let i=0; i<indices.length; i++) {
            if (indices.indexOf(i) === -1) {
                remove.push(i);
            }
        }

        copy.forEach((segment, i) => {
            if (remove.indexOf(i) > -1) {
                copy.eq(i).delete();
            }
        });

        devInfo(indices, 'indices', devInfoOn, devBlockName); // eslint-disable-line
        devInfo(remove, 'remove', devInfoOn, devBlockName); // eslint-disable-line
        devInfo(copy, 'copy after split', devInfoOn, devBlockName); // eslint-disable-line
        return copy;

        devBlockOver('stringArrayToNlp'); // eslint-disable-line
    }

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
