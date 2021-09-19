const skillParser =require('./parsers/skill-parser');
const entityParser =require('./parsers/entity-parser');
const physicalParser =require('./parsers/physical-parser');
const appearanceParser =require('./parsers/appearance-parser');

module.exports = async function parseDescriptions(doc) {
    doc.debug();

    function displayMatchInfo (matchData) {
        console.log('\n\x1b[1m' + matchData.parser + '\x1b[0m');
        console.log(matchData.clause.debug());

        matchData.evaluatedMatches.forEach(match => {
            console.log('\x1b[34m\nRule: ' + match.rule + '\x1b[0m');

            match.matchedTokens.forEach(token => {
                console.log(token);
            });
        });
    }

    // Search for the terms, sentence by sentence, clause by clause, in the doc.
    let sentences = doc.sentences();
    sentences.forEach(sentence => {

        let clauses = sentence.clauses();
        clauses.forEach(clause => {

            let skills = skillParser.parseSkills(clause);
            if (skills) {displayMatchInfo(skills);}
            let entity = entityParser.parseEntity(clause);
            if (entity) {displayMatchInfo(entity);}
            let physical = physicalParser.parsePhysical(clause);
            if (physical) {displayMatchInfo(physical);}
            let appearance = appearanceParser.parseAppearance(clause);
            if (appearance) {displayMatchInfo(appearance);}
        });
    });
};
