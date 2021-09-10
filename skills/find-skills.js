const st = require('./search-terms');

module.exports = async function findSkills(doc) {

    // Load the searchTerms from the search-terms JSON file.
    var searchTerms = [];
    for (let key in Object.keys(st)) {
        searchTerms.push(Object.values(st)[key]);
    }

    // // Prepare the doc
    // Set aside parantheticals


    // Search for the terms, sentence by sentence, clause by clause, in the doc.
    let sentences = doc.sentences();
    sentences.forEach(sentence => {

        let clauses = sentence.clauses();
        clauses.forEach(clause => {

            for (let j in searchTerms) {
                let searchTerm = searchTerms[j].search;
                if (clause.match(searchTerm).text() !== '') {
                    console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
                    console.log(clause.match(searchTerm).text());
                    let skill = clause.match(searchTerm, 'skill').text();
                    console.log(skill);

                }
            }
        });
    });
};
