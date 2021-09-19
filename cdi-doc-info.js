'use strict';
const nlp = require('compromise');
require('./initialize/load-tags');
const readline = require('readline');

posTagger();

function posTagger () {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter some text for NLP to parse:', (text) => {
        let cdi = nlp('');
        sleep(500).then(() => {
            cdi.loadCDITags();
        });

        sleep(500).then(() => {
            cdi.loadCDIWords();
        });

        setTimeout(() => {
            let doc = nlp(text);
            doc.debug();}
            , 2000
        );

        rl.close();
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
