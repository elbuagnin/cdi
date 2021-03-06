import nlp from 'compromise';
import preParser from '../../parser/pre-parser.js';

nlp.extend((Doc, world) => { // eslint-disable-line

    Doc.prototype.sentenceSyntax = function () {
        /* Development Options */
         let devBlockName = 'sentenceSyntax'; // eslint-disable-line
         let devInfoOn = false; // eslint-disable-line
        /***********************/
        let sentence = preParser(this);

        let parentheticals = this.parentheticals();
        sentence.match(parentheticals).delete();

        devInfo(sentence, 'sentence', devInfoOn, devBlockName); // eslint-disable-line
        sentence.sentencePhrasing().forEach (fragment => {
            fragment.gerundRoles();

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
