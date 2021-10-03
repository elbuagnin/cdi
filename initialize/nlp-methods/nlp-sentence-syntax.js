import nlp from 'compromise';

nlp.extend((Doc, world) => { // eslint-disable-line

    Doc.prototype.sentenceSyntax = function () {
        /* Development Options */
         let devBlockName = 'sentenceSyntax'; // eslint-disable-line
         let devInfoOn = true; // eslint-disable-line
         devBlock('sentenceSyntax', devInfoOn); // eslint-disable-line
        /***********************/

        let prepositionalPhrases = this.prepositionalPhrases();
        devInfo(prepositionalPhrases, 'prepositionalPhrases', devInfoOn, devBlockName)// eslint-disable-line

        let nounPhrase = this.nounPhrases();
        devInfo(nounPhrase, 'nounPhrase', devInfoOn, devBlockName)// eslint-disable-line

    };
});
