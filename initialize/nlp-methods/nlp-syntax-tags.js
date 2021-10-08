import nlp from 'compromise';

nlp.extend((Doc, world) => { // eslint-disable-line

    world.addTags({
        Clause: {
            isA: '',
            notA: 'Phrase'
        },
        Phrase: {
            isA: '',
            notA: ''
        },
        Independent: {
            isA: 'Clause',
            notA: 'Dependent'
        },
        Dependent: {
            isA: 'Clause',
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
        VerbalPhrase: {
            isA: 'NounPhrase',
            notA: 'VerbPhrase'
        },
        InfinitivePhrase: {
            isA: 'VerbPhrase',
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
            isA: 'VerbalPhrase',
            notA: ''
        },
        List: {
            isA: 'Phrase',
            notA: 'VerbPhrase'
        },
        Verbal: {
            isA: '',
            notA: 'Verb'
        },
        Participle: {
            iaA: 'Verbal',
            notA: ''
        },
        Subject: {
            isA: '',
            notA: 'Object'
        },
        Object: {
            isA: '',
            notA: 'Subject'
        },
        DirectObject: {
            isA: 'Object',
            notA: 'IndirectObject'
        },
        IndirectObject: {
            isA: 'Object',
            notA: 'DirectObject'
        },
        Possessive: {
            isA: '',
            notA: ['Noun', 'Pronoun']
        }
    });

    world.addWords({
        kermit: 'Character',
        gonzo: 'Character',
    });
});
