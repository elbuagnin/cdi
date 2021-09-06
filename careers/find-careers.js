module.exports = async function findCareers(doc) {
    const searchTerm = '#Principal #Copula #NounPhrase';

    if (doc.match(searchTerm)) { console.log('Career Positive!'); }
};
