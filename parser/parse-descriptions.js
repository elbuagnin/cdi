const skillTermData = require('./search-terms/skill-search-terms');
const appearanceTermData = require('./search-terms/appearance-search-terms');
const speciesTermData = require('./search-terms/species-search-terms.json');

module.exports = async function findSkills(doc) {
    var speciesSearchTerms = [];
    var skillSearchTerms = [];
    var appearanceSearchTerms = [];
    loadSearchTerms();

    // Search for the terms, sentence by sentence, clause by clause, in the doc.
    let sentences = doc.sentences();
    sentences.forEach(sentence => {

        let clauses = sentence.clauses();
        clauses.forEach(clause => {

            parseSkills(clause);
            parseSpecies(clause);
            parseAppearance(clause);
        });
    });

    function loadSearchTerms () {// Load the SearchTerms from the search-term JSON files.
        // Skills
        for (let key in Object.keys(skillTermData)) {
            skillSearchTerms.push(Object.values(skillTermData)[key]);
        }
        // Species
        for (let key in Object.keys(speciesTermData)) {
            speciesSearchTerms.push(Object.values(speciesTermData)[key]);
        }
        // Appearance
        for (let key in Object.keys(appearanceTermData)) {
            appearanceSearchTerms.push(Object.values(appearanceTermData)[key]);
        }
    }

    function parseSkills (clause) {
        for (let j in skillSearchTerms) {
            let searchTerm = skillSearchTerms[j].search;
            if (clause.match(searchTerm).text() !== '') {
                console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
                console.log(clause.match(searchTerm).text());
                let skill = clause.match(searchTerm, 'skill').text();
                console.log(skill);
                console.log('\x1b[37m', clause.out('tags'));

            }
        }
    }

    function parseSpecies (clause) {
        for (let j in speciesSearchTerms) {
            let searchTerm = speciesSearchTerms[j].search;
            if (clause.match(searchTerm).text() !== '') {
                console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
                console.log(clause.match(searchTerm).text());
                let skill = clause.match(searchTerm, 'skill').text();
                console.log(skill);
                console.log('\x1b[37m', clause.out('tags'));

            }
        }
    }

    function parseAppearance (clause) {
        for (let j in appearanceSearchTerms) {
            let searchTerm = appearanceSearchTerms[j].search;
            if (clause.match(searchTerm).text() !== '') {
                console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
                console.log(clause.match(searchTerm).text());
                let appearance = clause.match(searchTerm, 'appearance').text();
                console.log(appearance);
                console.log('\x1b[37m', clause.out('tags'));

            }
        }
    }
};
