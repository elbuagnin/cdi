const entityTermData = require('../search-terms/entity-search-terms');
var entitySearchTerms = [];

for (let key in Object.keys(entityTermData)) {
    entitySearchTerms.push(Object.values(entityTermData)[key]);
}

const parseEntity = function (clause) {
    for (let j in entitySearchTerms) {
        let searchTerm = entitySearchTerms[j].search;
        if (clause.match(searchTerm).text() !== '') {
            console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
            console.log(clause.match(searchTerm).text());
            let entity = clause.match(searchTerm, 'entity').text();
            console.log(entity);
            console.log('\x1b[37m', clause.out('tags'));
        }
    }
};

module.exports = {parseEntity};
