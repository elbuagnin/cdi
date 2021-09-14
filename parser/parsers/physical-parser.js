const physicalTermData = require('../search-terms/physical-search-terms');
var physicalSearchTerms = [];

for (let key in Object.keys(physicalTermData)) {
    physicalSearchTerms.push(Object.values(physicalTermData)[key]);
}

const parsePhysical = function (clause) {
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
    interpretInformation(information);
};

function interpretInformation (information) {

    // Solution to duplicate values in array by
    // @Author: Naveed Ali
    // Thanks!
    information.forEach((value, index, arr) => {
        let firstIndex = arr.indexOf(value);
        let lastIndex = arr.lastIndexOf(value);

        if (firstIndex !== lastIndex) {
            console.log('Dupe = ' + value);
        } else {
            console.log('Unique = ' + value);
        }
    });
}

module.exports = {parsePhysical};
