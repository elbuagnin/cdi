'use strict';
import './initialize/nlp-methods/nlp-custom-tags-words.js';
import './initialize/load-data.js';
import descriptionParser from './parser/parse-descriptions.js';
import statUpCharacter from './stats/statup-character.js';

export default function cdi(name, description) {


    //doc.contractions().expand();

    console.log('\x1b[1m', '\x1b[34m', '\n\n####################\n',name, '\n', '\x1b[0m');
    descriptionParser(name, description)
        .then(results => {
            statUpCharacter (results);
        });
}
