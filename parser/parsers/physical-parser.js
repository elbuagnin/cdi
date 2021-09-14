const physicalTermData = require('../search-terms/physical-search-terms');
var physicalSearchTerms = [];

for (let key in Object.keys(physicalTermData)) {
    physicalSearchTerms.push(Object.values(physicalTermData)[key]);
}

const parsePhysical = function (clause) {
    let matches = findMatches(clause);
    let duplicates = findDuplicates(matches);
    assignCharacteristics(matches, duplicates);

};

function findMatches (clause) {
    let information = [];

    for (let j in physicalSearchTerms) {
        let searchTerm = physicalSearchTerms[j].search;

        if (clause.match(searchTerm).text() !== '') {
            console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
            console.log(clause.match(searchTerm).text());
            let matches = clause.match(searchTerm).groups();
            for (let match in matches) {
                let info = '';
                info = matches[match].text();
                information.push(info);
            }
        }
    }
    return information;
}

function findDuplicates (matches) {

    // Solution to duplicate values in array by
    // @Author: Naveed Ali
    // Thanks!
    matches.forEach((value, index, arr) => {
        let duplicates = [];
        let firstIndex = arr.indexOf(value);
        let lastIndex = arr.lastIndexOf(value);

        if (firstIndex !== lastIndex) {
            duplicates.push(value);
        }

        return duplicates;
    });
}

function assignCharacteristics (matches, duplicates) {
    return;
}

module.exports = {parsePhysical};
