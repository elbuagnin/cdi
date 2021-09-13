const skillTermData = require('../search-terms/skill-search-terms');
var skillSearchTerms = [];

for (let key in Object.keys(skillTermData)) {
    skillSearchTerms.push(Object.values(skillTermData)[key]);
}

const parseSkills = function (clause) {
    for (let j in skillSearchTerms) {
        let searchTerm = skillSearchTerms[j].search;
        if (clause.match(searchTerm).text() !== '') {
            console.log('\x1b[1m', '\x1b[36m', searchTerm, '\x1b[0m');
            console.log(clause.match(searchTerm).text());
            let skill = clause.match(searchTerm, 'skill').text();
            console.log(skill);
            console.log('\x1b[37m', clause.out('tags'));
        }
    }
};

module.exports = {parseSkills};
