'use strict';
import './local-config.js';
import './initialize/nlp-methods/nlp-syntax-tags.js';
import './initialize/nlp-methods/nlp-syntax-helpers.js';
import './initialize/nlp-methods/nlp-syntax-methods.js';
import './initialize/nlp-methods/nlp-sentence-syntax.js';
import './initialize/nlp-methods/nlp-custom-tags-words.js';
import './initialize/load-data.js';
import descriptionParser from './parser/parse-descriptions.js';
import statUpCharacter from './statter/statup-character.js';

export default function cdi(description, name) {

    console.log('\x1b[1m', '\x1b[34m', '\n\n####################\n',name, '\n', '\x1b[0m');
    descriptionParser(description, name)
        .then(results => {
            statUpCharacter (results);
        });
}
