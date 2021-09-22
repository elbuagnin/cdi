const fs = require ('../helpers/filesystem');
const parser =require('./parser');
const rulePath = './parser/search-rules/';

module.exports = async function parseDescriptions(doc) {
    doc.debug();

    var ruleSets = await loadRules(rulePath);

    // Search for the terms, sentence by sentence, clause by clause, in the doc.
    let sentences = doc.sentences();
    sentences.forEach(sentence => {

        let clauses = sentence.clauses();
        clauses.forEach(clause => {

            for (let key = 0; key < ruleSets.length; key++) {
                let characteristics = parser.parse(clause, ruleSets[key]);
                if (characteristics) {displayMatchInfo(characteristics);}
            }
        });
    });

    async function loadRules (dir) {
        let rules = [];
        const fileType = '.json';
        for await (const file of fs.getFiles(dir, fileType)) {
            let searchRules = [];
            let fileData = await require (file);
            for (let key in Object.keys(fileData)) {
                searchRules.push(Object.values(fileData)[key]);
            }
            rules.push(searchRules);
        }
        return rules;
    }

    function displayMatchInfo (matchData) {
        console.log('\n\x1b[1m' + matchData.parser + '\x1b[0m');
        console.log(matchData.segment.debug());

        matchData.evaluatedMatches.forEach(match => {
            console.log('\x1b[34m\nRule: ' + match.rule + '\x1b[0m');

            match.matchedTokens.forEach(token => {
                console.log(token);
            });
        });
    }
};
