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

            skillParser.parseSkills(clause);
            entityParser.parseEntity(clause);
            physicalParser.parsePhysical(clause);
            appearanceParser.parseAppearance(clause);
        });
    });
};
