import * as mfs from '../lib/filesystem.js';
import path from 'path';
//import parser from './parser';
const rulePath = './parser/search-rules/';
import grammar from '../methods/grammar.js';

export default async function parseDescriptions(description, name) {
    var allCharacteristics = [];
    var ruleSets = await loadRules(rulePath);

    // Search for the terms, sentence by sentence, clause by clause, in the doc.
    let document = new grammar(description, name);
    //
    document.sentences.forEach(sentence => {
        console.log('##########################################################');
        console.log('Sentence: ' + sentence.text() );
    //sentence = new grammar(sentence);
    // let complete = sentence.isCompleteSentence();
    // let subject = sentence.getSubject();
    // let mainClause = sentence.getMainClause();
    // let mainVerb = sentence.getMainVerb();
    // console.log(complete + '\n' + JSON.stringify(mainClause) + '\n' + subject + ' : ' + mainVerb);
    // let clauses = sentence.clauses();
    // clauses.forEach(clause => {
    //
    //     for (let name in ruleSets) {
    //         let characteristics = parser.parse(clause, ruleSets[name]);
    //         if (characteristics) {
    //             Object.assign(characteristics, {ruleSet: name});
    //             allCharacteristics.push(characteristics);
    //             displayMatchInfo(characteristics);
    //         }
    //     }
    // });
    });

    if (allCharacteristics) {
        return allCharacteristics;
    } else {
        return false;
    }

    async function loadRules (dir) {
        let rules = [];
        const fileType = '.json';
        for await (const file of mfs.getFileNames(dir, fileType)) {
            let fileName = path.basename(file);
            let ruleSetName = fileName.substring(0, fileName.indexOf('-'));
            let searchRules = [];
            let fileData = await mfs.loadJSONFile (file);
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
}
