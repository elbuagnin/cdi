const fs = require ('../helpers/filesystem');
const path = require ('path');
const parser =require('./parser');
const rulePath = './parser/search-rules/';

module.exports = async function parseDescriptions(doc) {
    doc.debug();
    var allCharacteristics = [];
    var ruleSets = await loadRules(rulePath);

    // Search for the terms, sentence by sentence, clause by clause, in the doc.
    let sentences = doc.sentences();
    sentences.forEach(sentence => {
        console.log('##########################################################');
        console.log('Sentence: ' + sentence.text() );

        let clauses = sentence.clauses();
        clauses.forEach(clause => {

            for (let name in ruleSets) {
                let characteristics = parser.parse(clause, ruleSets[name]);
                if (characteristics) {
                    Object.assign(characteristics, {ruleSet: name});
                    allCharacteristics.push(characteristics);
                    displayMatchInfo(characteristics);
                }
            }
        });
    });
    if (allCharacteristics) {
        return allCharacteristics;
    } else {
        return false;
    }

    async function loadRules (dir) {
        let rules = [];
        const fileType = '.json';
        for await (const file of fs.getFiles(dir, fileType)) {
            let fileName = path.basename(file);
            let ruleSetName = fileName.substring(0, fileName.indexOf('-'));
            let searchRules = [];
            let fileData = await require (file);
            for (let key in Object.keys(fileData)) {
                searchRules.push(Object.values(fileData)[key]);
            }
            rules[ruleSetName] = searchRules;
        }
        return rules;
    }

    function displayMatchInfo (matchData) {
        console.log('\n\x1b[1m' + matchData.ruleSet + '\x1b[0m');
        console.log(matchData.segment.debug());

        matchData.evaluatedMatches.forEach(match => {
            console.log('\x1b[34m\nRule: ' + match.rule + '\x1b[0m');
            console.log('RuleType: ' + match.ruleType);

            if (match.ruleType === 'search')   {
                match.matchedTokens.forEach(token => {
                    console.log(token);
                });
            } else if (match.ruleType === 'count') {
                console.log(match.matchData);
            }
        });
    }
};
