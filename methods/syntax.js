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
        /* Development Options */
        let devBlockName = 'nounPhrases';
        let devInfoOn = false;
        devBlock('nounPhrases', devInfoOn);  // eslint-disable-line
        /***********************/

        let phrases = [];
        let nouns = this.nouns().reverse();
        devInfo(nouns, 'nouns'); // eslint-disable-line

        nouns.forEach(noun => {
            let nounPhrase = noun.text();
            let currentMatch = noun;
            while(currentMatch !== false) {
                let preceedingTerm = this.match(currentMatch).justBefore();
                if (preceedingTerm.not('#Verb').found) {
                    currentMatch = preceedingTerm;
                    nounPhrase = currentMatch.text() + ' ' + nounPhrase;
                } else {
                    currentMatch = false;
                }
            }
            devInfo(nounPhrase, 'nounPhrase', devInfoOn, devBlockName); // eslint-disable-line
            phrases.push(nounPhrase);
            devInfo(phrases, 'phrases before', devInfoOn, devBlockName); // eslint-disable-line

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
        let nounPhrases = stringArrayToNlp(this, phrases);
        syntaxTag(nounPhrases, 'NounPhrase');
        devInfo(nounPhrases, 'Returing nounPhrases', devInfoOn, devBlockName); // eslint-disable-line
        return nounPhrases;
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

        let prepositions = this.prepositions().out('array'); //.json().map(o=>o.text);
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

        return stringArrayToNlp(this, phrases);
    };

    Doc.prototype.justBefore = function () {

        let precedingWords = this.parent().before(this);
        let precedingWord = precedingWords.lastTerms();

        if (precedingWord.found) {
            return precedingWord;
        } else return this.match('');
    };

    Doc.prototype.justAfter = function () {

        let succeedingWords = this.parent().after(this);
        let succeedingWord = succeedingWords.firstTerms();

        if (succeedingWord.found) {
            return succeedingWord;
        } else return this.match('');
    };

    // Private Helpers
    const tagIDs = {};
    function* generateID (tag) {
        if (tag in tagIDs) {
            tagIDs[tag]++;
        } else {
            tagIDs[tag] = 0;
        }
        yield tag + tagIDs[tag];
    }

    function syntaxTag(doc, tag) {
        doc.forEach (item => {
            let id = generateID(tag).next().value;
            devInfo(id, 'id'); // eslint-disable-line
            item.tag(tag);
            item.tag(id);
        });
    }

    function stringArrayToNlp (doc, arrayOfStrings) {
        /* Development Options */
        let devBlockName = 'stringArrayToNlp';
        let devInfoOn = false;
        devBlock('stringArrayToNlp', devInfoOn); // eslint-disable-line
        /***********************/

        devInfo(arrayOfStrings, 'Incomming arrayOfStrings', devInfoOn, devBlockName); // eslint-disable-line
        arrayOfStrings.forEach(string => {
            devInfo(string, 'string to split on', devInfoOn, devBlockName); // eslint-disable-line
            doc = doc.splitBefore(string);
            doc = doc.splitAfter(string);
        });

        devInfo(doc.length, 'doc.length', devInfoOn, devBlockName); // eslint-disable-line
        const indices = [];
        devInfo(indices, 'indices', devInfoOn, devBlockName); // eslint-disable-line
        doc.forEach((segment, index) => {
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

        doc.forEach((segment, i) => {
            if (remove.indexOf(i) > -1) {
                doc.eq(i).delete();
            }
        });

        devInfo(indices, 'indices', devInfoOn, devBlockName); // eslint-disable-line
        devInfo(remove, 'remove', devInfoOn, devBlockName); // eslint-disable-line
        devInfo(doc, 'doc after split', devInfoOn, devBlockName); // eslint-disable-line
        return doc;
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
