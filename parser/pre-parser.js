import * as mfs from '../lib/filesystem.js';
//import nlp from 'compromise';

export default async function preParser(document) {
    /* Development Options */
    let devBlockName = 'preParser'; // eslint-disable-line
    let devInfoOn = true; // eslint-disable-line
    devBlock('preParser', devInfoOn); // eslint-disable-line
    /***********************/

    const rulePath = './parser/syntax-rules/';
    let dataset = await loadJSONData (rulePath);
    document.contractions().expand();

    Object.values(JSON.parse(dataset)).forEach(rule => {
        let term = rule.term;
        let pattern = rule.pattern;
        let tag = rule.tag;
        console.log(term + ' : ' + pattern + ' : ' + tag);
        devInfo(document, 'document', devInfoOn, devBlockName); // eslint-disable-line
        if (term && pattern && tag) {
            if (document.has(pattern)) {
                document.match(pattern).match(term).tag(tag);
            }
        }
    });


    async function loadJSONData(dir) {
        const fileType = '.json';

        for await (const file of mfs.getFileNames(dir, fileType)) {
            let dataset = await mfs.loadJSONFile(file);
            return dataset;
        }
    }
}
