const appearanceTermData = require('../search-terms/appearance-search-terms');
var appearanceSearchTerms = [];

for (let key in Object.keys(appearanceTermData)) {
    appearanceSearchTerms.push(Object.values(appearanceTermData)[key]);
}

const parseAppearance = function (clause) {
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
};

module.exports = {parseAppearance};
