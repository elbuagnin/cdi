const nlp = require('compromise');
require ('./extend-nlp');
var primer = nlp('');
const fs = require ('../helpers/filesystem');
const baseDir = './initialize/';
const tagDir = baseDir + 'tags/';
const wordDir = baseDir + 'words/';

loadData (tagDir, 'tags')
     .catch(console.error);
loadData (wordDir, 'words')
     .catch(console.error);

async function loadData(dir, dataType) {
    const fileType = '.json';
    for await (const file of fs.getFiles(dir, fileType)) {
        let dataset = await require(file);
        if (dataType === 'tags') {
            primer.addCustomTags([dataset]);
        }
        if (dataType === 'words') {
            primer.addCustomWords([dataset]);
        }
    }
}
