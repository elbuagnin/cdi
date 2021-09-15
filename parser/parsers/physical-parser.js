const physicalTermData = require('../search-terms/physical-search-terms');
var physicalSearchTerms = [];

for (let key in Object.keys(physicalTermData)) {
    physicalSearchTerms.push(Object.values(physicalTermData)[key]);
}

const parsePhysical = function (clause) {
    var evaluatedMatches = {};
    let matchedRules = findMatches(clause);
    if (matchedRules.length !== 0) {
        evaluatedMatches = evaluateMatches(matchedRules);
    }

    if (_.size(evaluatedMatches) > 0) {
        const parsedObject = {clause: clause, evaluatedMatches: evaluatedMatches};
        console.log(JSON.stringify(parsedObject));
        return parsedObject;
    } else {
        return false;
    }
};

function findMatches (clause) {
    let matchedRules = [];

    for (let key in physicalSearchTerms) {
        let searchTerm = physicalSearchTerms[key].search;
        let matchData = physicalSearchTerms[key].matchData;

        if (clause.match(searchTerm).text() !== '') {
            let matchedValues = [];
            let matches = clause.match(searchTerm).groups();
            for (let match in matches) {
                let matchTerm = '';
                matchTerm = matches[match].text();
                matchedValues.push(matchTerm);
            }
            let obj = {rule: searchTerm, matchedValues: matchedValues, matchData: matchData};
            matchedRules.push(obj);
        }
    }
    return matchedRules;
}

function evaluateMatches (matchedRules) {
    let valuesList = [];
    let valuesData = [];
    let evaluatedMatches = {};

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
                valuesList.push(values[key]);
                valuesData.push({token: matchDataList[key].token, value: values[key], tokenConfidence: matchDataList[key].tokenConfidence});
            } else {
                valuesData[key]['tokenConfidence'] += matchDataList[key].tokenConfidence;
            }
        }
        evaluatedMatches = {rule: rule, matchedTokens: valuesData};
    }
    return evaluatedMatches;
}

module.exports = {parsePhysical};
