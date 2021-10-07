import nlp from 'compromise';

nlp.extend((Doc, world) => { // eslint-disable-line

    Doc.prototype.sentenceSyntax = function () {
        /* Development Options */
         let devBlockName = 'sentenceSyntax'; // eslint-disable-line
         let devInfoOn = true; // eslint-disable-line
         devBlock('sentenceSyntax', devInfoOn); // eslint-disable-line
        /***********************/
        let sentence = this;
        sentence.contractions().expand();

        let parentheticals = this.parentheticals();
        sentence.match(parentheticals).delete();

        devInfo(parentheticals, 'parentheticals', devInfoOn, devBlockName); // eslint-disable-line


        this.clauses().forEach (fragment => {
            let gerundPhrases = fragment.gerundPhrases();
            devInfo(gerundPhrases, 'gerundPhrases', devInfoOn, devBlockName); // eslint-disable-line

            let prepositionalPhrases = fragment.prepositionalPhrases();
            devInfo(prepositionalPhrases, 'prepositionalPhrases', devInfoOn, devBlockName)// eslint-disable-line

            let nounPhrases = fragment.nounPhrases();
            devInfo(nounPhrases, 'nounPhrases', devInfoOn, devBlockName)// eslint-disable-line

            let verbPhrases = fragment.verbPhrases();
            devInfo(verbPhrases, 'verbPhrases', devInfoOn, devBlockName); // eslint-disable-line

            devInfo(fragment, 'fragment', devInfoOn, devBlockName); // eslint-disable-line
        });
    };
});
