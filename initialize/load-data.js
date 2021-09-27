import nlp from 'compromise';
import * as mfs from '../helpers/filesystem.js';
const baseDir = './initialize/';
const tagDir = baseDir + 'tags/';
const wordDir = baseDir + 'words/';

loadJSONData (tagDir, 'tags')
    .catch(console.error);
loadJSONData (wordDir, 'words')
    .catch(console.error);

async function loadJSONData(dir, dataType) {
    const fileType = '.json';
    const primer = nlp('');

    for await (const file of mfs.getFileNames(dir, fileType)) {
        let dataset = await mfs.loadJSONFile(file);
        if (dataType === 'tags') {
            primer.addCustomTags([dataset]);
        }
        if (dataType === 'words') {
            primer.addCustomWords([dataset]);
        }
    }
}
