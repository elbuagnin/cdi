const skillTermData = require('./search-terms/skill-search-terms');
const appearanceTermData = require('./search-terms/appearance-search-terms');
const entityTermData = require('./search-terms/entity-search-terms.json');
const bodyTermData = require('./search-terms/body-search-terms');

module.exports = async function findSkills(doc) {
    var entitySearchTerms = [];
    var skillSearchTerms = [];
    var appearanceSearchTerms = [];
    var bodySearchTerms = [];
    loadSearchTerms();

    // Search for the terms, sentence by sentence, clause by clause, in the doc.
    let sentences = doc.sentences();
    sentences.forEach(sentence => {

        let clauses = sentence.clauses();
        clauses.forEach(clause => {

            parseSkills(clause);
            parseEntity(clause);
            parseBody(clause);
            parseAppearance(clause);
        });
    });

    function loadSearchTerms () {// Load the SearchTerms from the search-term JSON files.
        // Skills
        for (let key in Object.keys(skillTermData)) {
            skillSearchTerms.push(Object.values(skillTermData)[key]);
        }
        // entity
        for (let key in Object.keys(entityTermData)) {
            entitySearchTerms.push(Object.values(entityTermData)[key]);
        }
        // Appearance
        for (let key in Object.keys(appearanceTermData)) {
            appearanceSearchTerms.push(Object.values(appearanceTermData)[key]);
        }
        // Body
        for (let key in Object.keys(bodyTermData)) {
            bodySearchTerms.push(Object.values(bodyTermData)[key]);
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

    function parseEntity (clause) {
        for (let j in entitySearchTerms) {
            let searchTerm = entitySearchTerms[j].search;
            if (clause.match(searchTerm).text() !== '') {
                console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
                console.log(clause.match(searchTerm).text());
                let skill = clause.match(searchTerm, 'skill').text();
                console.log(skill);
                console.log('\x1b[37m', clause.out('tags'));

            }
        }
    }

    function parseBody (clause) {
        for (let j in bodySearchTerms) {
            let searchTerm = bodySearchTerms[j].search;
            if (clause.match(searchTerm).text() !== '') {
                console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
                console.log(clause.match(searchTerm).text());
                let groups = clause.match(searchTerm).groups();
                console.log(groups);
                //let weight = clause.match(searchTerm, 'weight').text();
                //console.log(weight);
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
