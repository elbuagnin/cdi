'use strict';
const nlp = require('compromise');
const readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question('Enter some text for NLP to parse:', (text) => {

    nlp(text).debug();

    rl.close();
});
