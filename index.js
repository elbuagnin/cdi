'use strict';
import './local-config.js';
import './initialize/nlp-methods/nlp-custom-tags-words.js';
import './initialize/load-data.js';
import descriptionParser from './parser/parse-descriptions.js';
import statUpCharacter from './stats/statup-character.js';

export default function cdi(description, name) {


    //doc.contractions().expand();

    console.log('\x1b[1m', '\x1b[34m', '\n\n####################\n',name, '\n', '\x1b[0m');
    descriptionParser(description, name)
        .then(results => {
            statUpCharacter (results);
        });
}
