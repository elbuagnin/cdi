const nlp = require('compromise');
require ('./extend-nlp');
var primer = nlp('');

const fs = require('fs');
const baseDir = './initialize/';
const suffix = '.json';
var allTagData = [];
var allWordData = [];

async function loadTags(path) {
    debugger;
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {

        if (dirent.name.substr(-5, 5) === suffix) {
            let dataset = await require('./tags/' + dirent.name);
            primer.addCustomTags({dataset});
        }
    }
    return allTagData;
}

async function loadWords(path) {
    debugger;
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {

        if (dirent.name.substr(-5, 5) === suffix) {
            let dataset = await require('./words/' + dirent.name);
            primer.addCustomWords({dataset});
        }
    }
    return allWordData;
}

loadTags(baseDir + 'tags/')
   .catch(console.error);
loadWords(baseDir + 'words/')
   .catch(console.error);
