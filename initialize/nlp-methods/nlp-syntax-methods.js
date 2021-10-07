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
            if (conjunction.previous().has('@hasComma')) {
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
        // @Examples
        // street corner wonderlust
        // owner of a lonely heart
        // a yellow submarine

        let sentence = this;
        let phrases = [];
        let strPhrases = [];

        // Find all nouns.
        let nouns = sentence.match('#Noun').not('#Possessive'); // Do .match('#Noun') instead of .nouns to include pronouns.

        // Look for potential head nouns of noun phrases.
        // If they can form a phrase, they are the head of a noun phrase.
        nouns.forEach(noun => {
            let nounPhrase = sentence.phraseBackward(noun,
                [
                    {term: '#Determiner', terminal: true, include: true},
                    {term: '#Possessive', terminal: true, include: true},
                    {term: '#Preposition', terminal: true, include: false},
                    {term: '#Verb', terminal: true, include: false},
                    {term: '#Adverb', terminal: false}
                ]);
            phrases.push(nounPhrase);
        });

        // Convert to string to make a mask. Check for duplicates.
        strPhrases = phrases.NlpArrayToString();
        strPhrases = strPhrases.noSubDupes();

        // Convert back to NLP, tag 'em and bag 'em.
        let nounPhrases = sentence.mask(strPhrases);
        sentence.syntaxTag(nounPhrases, 'NounPhrase');

        return nounPhrases;
    };

    Doc.prototype.prepositionalPhrases = function () {
        // @Examples
        // in Cherry Hill Lane
        // of the turning away
        // of a thousand dances
        // in Cherry Hill Park
        // in a coalmine

        let sentence = this;
        let phrases = [];
        let strPhrases = [];

        // Find all prepositions.
        let prepositions = sentence.prepositions();

        // Do the form a phrase by ending in a noun or acting noun?
        prepositions.forEach(preposition => {
            let prepositionalPhrase = sentence.phraseForward(preposition,
                [
                    {term: '#Noun', terminal: true, include: true},
                    {term: '#Gerund', terminal: true, include: true},
                    {term: '#Possessive', terminal: false},
                    {term: '#Adverb', terminal: false}
                ]);
            phrases.push(prepositionalPhrase);
        });

        // Search forward fo the noun that ends the prepositional phrase.
        // @example: for [country] and [honor]
        // @example: of the [people]
        prepositions.forEach(preposition => {
            let prepositionPhrase = sentence.phraseForward(preposition,
                [
                    {term: '#Noun', terminal: true, include: true},
                    {term: '#Gerund', terminal: true, include: true},
                    {term: '#Preposition', terminal: false, subset: true},
                    {term: '#Pronoun', terminal: false},
                    {term: '#Possessive', terminal: false},
                    {term: '#Adverb', terminal: false}
                ]);
            phrases.push(prepositionPhrase);
        });

        // Convert to string to make a mask. Check for duplicates.
        strPhrases = phrases.NlpArrayToString();
        strPhrases = strPhrases.noSubDupes();

        // Convert back to NLP, tag 'em and bag 'em.
        let prepositionalPhrases = sentence.mask(strPhrases);
        sentence.syntaxTag(prepositionalPhrases, 'PrepositionalPhrase');
        let prepositionPhrases = sentence.mask(strPhrases);
        sentence.syntaxTag(prepositionPhrases, 'PrepositionalPhrase');

        return prepositionPhrases;
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
