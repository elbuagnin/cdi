// Main function
// Takes a string and parses it using JSON file rules to find useful characteristics.
const parse = function (segment, searchRules) {
    var evaluatedMatches = {};
    let matchedRules = findMatches(segment, searchRules);
    if ((matchedRules.length !== 0)) {
        evaluatedMatches = evaluateMatches(matchedRules);
    }

    if (_.size(evaluatedMatches) > 0) {
        const parsedObject = {segment: segment, evaluatedMatches: evaluatedMatches};
        return parsedObject;
    } else {
        return false;
    }
};

// Finds all the rules that match the text.
function findMatches (segment, searchRules) {
    let ruleType = undefined;
    let matchedRules = [];

    for (let key in searchRules) {
        let matchData = searchRules[key].matchData;
        let searchTerm = undefined;

        if (searchRules[key].search) {
            ruleType = 'search';
            searchTerm = searchRules[key].search;
            if (searchTerm.regex) {
                searchTerm.regex = new RegExp(searchTerm.regex, 'g'); // Have to convert from JSON
            }
            if (segment.match(searchTerm).found) {
                let matchedValues = [];
                let matches = segment.match(searchTerm).groups();
                for (let match in matches) {
                    let matchTerm = '';
                    matchTerm = matches[match].text();
                    matchedValues.push(matchTerm);
                }

                let obj = {ruleType: ruleType, rule: searchTerm, matchedValues: matchedValues, matchData: matchData};
                matchedRules.push(obj);
            }
        } else if (searchRules[key].count) {
            ruleType = 'count';
            let count = 0;
            let matches = [];
            let searchTerm = searchRules[key].count;

            matches = segment.match(searchTerm);
            if (matches.length > 0) {
                count = matches.length;
                Object.assign(matchData, {count: count});
                let obj = {ruleType: ruleType, rule: searchTerm, matchedValues: matches, matchData: matchData};
                matchedRules.push(obj);
            }

        }
    }
    return matchedRules;
}

function evaluateMatches (matchedRules) {
    let evaluatedMatches = [];

    for (let key in matchedRules) {
        let ruleType = matchedRules[key].ruleType;
        let rule = matchedRules[key].rule;
        let values = matchedRules[key].matchedValues;
        let matchData = matchedRules[key].matchData;

        if (ruleType === 'search') {
            // make matchData iterable.
            let matchDataList = [];
            for (let key in matchData) {
                let obj = {token: key, tokenConfidence: matchData[key]};
                matchDataList.push(obj);
            }
            // merge repeated tokens and add up the confidence data.
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
            let obj = {ruleType: ruleType, rule: rule, matchedTokens: valuesData};
            evaluatedMatches.push(obj);

        } else if (ruleType === 'count') {
            Object.assign(matchData, {values: values});
            let obj = {ruleType: ruleType, rule: rule, matchData: matchData};
            evaluatedMatches.push(obj);
        }
    }
    return evaluatedMatches;
}

module.exports = {parse};
