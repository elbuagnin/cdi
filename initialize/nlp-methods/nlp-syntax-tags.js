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
        AdverbPhrase: {
            isA: 'Phrase',
            notA: ''
        },
        PrepositionPhrase: {
            isA: 'Phrase',
            notA: ''
        },
        GerundPhrase: {
            isA: '',
            notA: ''
        },
        List: {
            isA: '',
            notA: ''
        }
    });
});
