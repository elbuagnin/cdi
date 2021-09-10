const st = require('./search-terms');

module.exports = async function findSkills(doc) {

    // Load the searchTerms from the search-terms JSON file.
    var searchTerms = [];
    for (let key in Object.keys(st)) {
        searchTerms.push(Object.values(st)[key]);
    }

    // Search for the terms by sentence in the doc.
    let sentences = doc.sentences();
    sentences.forEach(sentence => {

        for (let j in searchTerms) {
            let searchTerm = searchTerms[j].search;
            if (sentence.match(searchTerm).text() !== '') {
                console.log(searchTerm);
                console.log(sentence.match(searchTerm).text());
            }
        }
    });
};
