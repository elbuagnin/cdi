export default async function assignStats (characteristics) {
    var archetypeCounts = [];
    archetypeCounts['RogueType'] = 0;
    // for (let set in characteristics) {
    characteristics.forEach (set => {

        let ruleSet = set.ruleSet;
        let segment = set.segment;

        set.evaluatedMatches.forEach (match => {
            let rule = match.rule;
            let tokenMatches = [];
            let countMatches = [];

            let ruleType = match.ruleType;
            if (ruleType === 'search') {
                tokenMatches = match.matchedTokens;
            } else if (ruleType === 'count') {
                countMatches = match.matchData;
                let archetype = countMatches.Archetype;

                if (!archetypeCounts[archetype]) {
                    archetypeCounts[archetype] = 1;
                } else {
                    let a = parseInt(archetypeCounts[archetype]);
                    let b = parseInt(countMatches.count);
                    let newCount = a + b;
                    archetypeCounts[archetype] = newCount;
                }
            }
        });
        console.log(segment.text());
        console.log(archetypeCounts);
    });
}
