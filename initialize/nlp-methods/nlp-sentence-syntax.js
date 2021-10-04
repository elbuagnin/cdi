import nlp from 'compromise';

nlp.extend((Doc, world) => { // eslint-disable-line

    Doc.prototype.sentenceSyntax = function () {
        /* Development Options */
         let devBlockName = 'sentenceSyntax'; // eslint-disable-line
         let devInfoOn = false; // eslint-disable-line
         devBlock('sentenceSyntax', devInfoOn); // eslint-disable-line
        /***********************/

        let prepositionalPhrases = this.prepositionalPhrases();
        devInfo(prepositionalPhrases, 'prepositionalPhrases', devInfoOn, devBlockName)// eslint-disable-line

        let nounPhrases = this.nounPhrases();
        devInfo(nounPhrases, 'nounPhrases', devInfoOn, devBlockName)// eslint-disable-line
    };
});
