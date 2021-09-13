const physicalTermData = require('../search-terms/physical-search-terms');
var physicalSearchTerms = [];

for (let key in Object.keys(physicalTermData)) {
    physicalSearchTerms.push(Object.values(physicalTermData)[key]);
}

const parsePhysical = function (clause) {
    for (let j in physicalSearchTerms) {
        let searchTerm = physicalSearchTerms[j].search;
        if (clause.match(searchTerm).text() !== '') {
            console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
            console.log(clause.match(searchTerm).text());
            let physical = clause.match(searchTerm, 'physical').text();
            console.log(physical);
            console.log('\x1b[37m', clause.out('tags'));
        }
    }
};

module.exports = {parsePhysical};
