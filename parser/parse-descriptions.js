const parser =require('./parser');
const rulePath = './search-rules/';

module.exports = function parseDescriptions(doc) {
    doc.debug();

    const skillRules = loadRules ('skill-search-terms');
    const entityRules = loadRules ('entity-search-terms');
    const physicalRules = loadRules ('physical-search-terms');
    const appearanceRules = loadRules ('appearance-search-terms');

    // Search for the terms, sentence by sentence, clause by clause, in the doc.
    let sentences = doc.sentences();
    sentences.forEach(sentence => {

        let clauses = sentence.clauses();
        clauses.forEach(clause => {

            let skills = parser.parse(clause, skillRules);
            if (skills) {displayMatchInfo(skills);}

            let entity = parser.parse(clause, entityRules);
            if (entity) {displayMatchInfo(entity);}

            let physical = parser.parse(clause, physicalRules);
            if (physical) {displayMatchInfo(physical);}

            let appearance = parser.parse(clause, appearanceRules);
            if (appearance) {displayMatchInfo(appearance);}
        });
    });

    function loadRules (file) {
        let fileData = '';
        let searchRules = [];
        fileData = require (rulePath + file);
        for (let key in Object.keys(fileData)) {
            searchRules.push(Object.values(fileData)[key]);
        }

        return searchRules;
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
