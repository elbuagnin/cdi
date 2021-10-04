import nlp from 'compromise';

nlp.extend((Doc, world) => { // eslint-disable-line

    world.addTags({
        Clause: {
            isA: '',
            notA: 'Phrase'
        },
        Phrase: {
            isA: '',
            notA: 'Clause'
        },
        Independent: {
            isA: '',
            notA: 'Dependent'
        },
        Dependent: {
            isA: '',
            notA: 'Independent'
        },
        NounPhrase: {
            isA: 'Phrase',
            notA: 'VerbPhrase'
        },
        VerbPhrase: {
            isA: 'Phrase',
            notA: 'NounPhrase'
        },
        AdverbialPhrase: {
            isA: 'Phrase',
            notA: ''
        },
        PrepositionalPhrase: {
            isA: 'Phrase',
            notA: ''
        }
    });
});
