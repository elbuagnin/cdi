const physicalTermData = require('../search-terms/physical-search-terms');
var physicalSearchTerms = [];

for (let key in Object.keys(physicalTermData)) {
    physicalSearchTerms.push(Object.values(physicalTermData)[key]);
}

const parsePhysical = function (clause) {
    let matchedRules = findMatches(clause);
    if (matchedRules.length !== 0) {
        evaluateMatches(matchedRules);
    }
};

function findMatches (clause) {
    let matchedRules = [];

    for (let key in physicalSearchTerms) {
        let searchTerm = physicalSearchTerms[key].search;
        let matchData = physicalSearchTerms[key].matchData;

        if (clause.match(searchTerm).text() !== '') {
            console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
            console.log(clause.match(searchTerm).text());
            let matchedValues = [];
            let matches = clause.match(searchTerm).groups();
            for (let match in matches) {
                let matchTerm = '';
                matchTerm = matches[match].text();
                matchedValues.push(matchTerm);
            }
            let obj = {clause: clause, rule: searchTerm, matchedValues: matchedValues, matchData: matchData};
            matchedRules.push(obj);
        }
    }
    return matchedRules;
}

function evaluateMatches (matchedRules) {
    console.log('jtest: '+JSON.stringify(matchedRules));
    let valuesList = [];
    let valuesData = [];
    let evaluatedMatches = [];

    for (let key in matchedRules) {
        let rule = matchedRules[key].rule;
        let values = matchedRules[key].matchedValues;
        let matchData = matchedRules[key].matchData;
        // make matchData iterable.
        let matchDataList = [];
        for (let key in matchData) {
            let obj = {token: key, tokenConfidence: matchData[key]};
            matchDataList.push(obj);
        }

        for (let key in values) {
            if (valuesList.indexOf(values[key])) {
                console.log('not found');
                valuesList.push(values[key]);
                valuesData.push({token: matchDataList[key].token, value: values[key], tokenConfidence: matchDataList[key].tokenConfidence});
            } else {
                console.log('found');
                valuesData[key]['tokenConfidence'] += matchDataList[key].tokenConfidence;
            }
        }
        evaluatedMatches.push({rule: rule});
    }
    return;
}

module.exports = {parsePhysical};
