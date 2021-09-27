'use strict';
import './extend-nlp.js';
import './initialize/load-data.js';
//import ntClass from './name/name-tagger.js';
import descriptionParser from './parser/parse-descriptions.js';
import statUpCharacter from './stats/statup-character.js';

export default function cdi(name, description) {

    //var doc = nlp(description); // Natural Language Parser
    //doc.contractions().expand();
    //new ntClass(name, doc); // Tag the name of the character
    console.log('\x1b[1m', '\x1b[34m', '\n\n####################\n',name, '\n', '\x1b[0m');
    descriptionParser(description)
        .then(results => {
            statUpCharacter (results);
        });



    // const preppedDoc = {doc: doc};
    // return (preppedDoc);
}
