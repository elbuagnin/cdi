const skillParser =require('./parsers/skill-parser');
const entityParser =require('./parsers/entity-parser');
const physicalParser =require('./parsers/physical-parser');
const appearanceParser =require('./parsers/appearance-parser');

module.exports = async function parseDescriptions(doc) {
    doc.debug();

    // Search for the terms, sentence by sentence, clause by clause, in the doc.
    let sentences = doc.sentences();
    sentences.forEach(sentence => {

        let clauses = sentence.clauses();
        clauses.forEach(clause => {

            let skills = skillParser.parseSkills(clause);
            if (skills) {console.log(skills);}
            let entity = entityParser.parseEntity(clause);
            if (entity) {console.log(entity);}
            let physical = physicalParser.parsePhysical(clause);
            if (physical) {console.log(physical);}
            let appearance = appearanceParser.parseAppearance(clause);
            if (appearance) {console.log(appearance);}
        });
    });
};
