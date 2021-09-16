const physicalTermData = require('../search-terms/physical-search-terms');
var physicalSearchTerms = [];

// Load the Parsing rules
for (let key in Object.keys(physicalTermData)) {
    physicalSearchTerms.push(Object.values(physicalTermData)[key]);
}

// Main function
// Takes a string and parses it using JSON file rules to find useful characteristics.
const parsePhysical = function (clause) {
    var evaluatedMatches = {};
    let matchedRules = findMatches(clause);
    if (matchedRules.length !== 0) {
        evaluatedMatches = evaluateMatches(matchedRules);
    }

    if (_.size(evaluatedMatches) > 0) {
        const parsedObject = {clause: clause, evaluatedMatches: evaluatedMatches};
        return parsedObject;
    } else {
        return false;
    }
};

// Finds all the rules that match the text.
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

// Goes through the matches, merges repeated tokens, and pulls in token names and confidence data from rules.
function evaluateMatches (matchedRules) {
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

        let valuesList = [];
        let valuesData = [];
        for (let key in values) {
            if (valuesList.indexOf(values[key])) {
                valuesList.push(values[key]);
                valuesData.push({token: matchDataList[key].token, value: values[key], tokenConfidence: matchDataList[key].tokenConfidence});
            } else {
                valuesData[key]['tokenConfidence'] += matchDataList[key].tokenConfidence;
            }
        }
        let obj = {rule: rule, matchedTokens: valuesData};
        evaluatedMatches.push(obj);
    }
    return evaluatedMatches;
}

module.exports = {parsePhysical};
