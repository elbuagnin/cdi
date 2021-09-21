const nlp = require('compromise');
require ('./extend-nlp');
var primer = nlp('');
const { resolve } = require('path');
const { readdir } = require('fs').promises;
const baseDir = './initialize/';
const tagDir = baseDir + 'tags/';
const wordDir = baseDir + 'words/';

loadData (tagDir, 'tags')
     .catch(console.error);
loadData (wordDir, 'words')
     .catch(console.error);

async function loadData(dir, dataType) {
    const fileType = '.json';
    for await (const file of getFiles(dir, fileType)) {
        let dataset = await require(file);
        if (dataType === 'tags') {
            primer.addCustomTags([dataset]);
        }
        if (dataType === 'words') {
            primer.addCustomWords([dataset]);
        }
    }
}

// @Author https://stackoverflow.com/a/45130990/16726930
async function* getFiles(dir, fileType) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res, fileType);
        } else if (res.substr(-5, 5) === fileType) { // a better way?
            yield res;
        }
    }
}
