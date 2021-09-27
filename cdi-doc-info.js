'use strict';
import nlp from 'compromise';
import loadData from './initialize/load-data';
import readline from 'readline';

posTagger();

function posTagger () {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter some text for NLP to parse:', (text) => {
        setTimeout(() => {
            let doc = nlp(text);
            doc.debug();}
            , 2000
        );

        rl.close();
    });
}
