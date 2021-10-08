import nlp from 'compromise';

const nothing = '';
let empty = nlp(nothing);

nlp.extend((Doc, world) => { // eslint-disable-line

    Doc.prototype.sentencePhrasing = function () {
        let sentence = this;

        sentence.listPhrases();

        sentence = sentence.split('@hasSemicolon');
        sentence = sentence.splitOnAround('@hasComma', '#List+');

        return sentence;
    };

    Doc.prototype.listPhrases = function () {
        let sentence = this;

        let listPhrases = sentence.lists();

        if (listPhrases.found) {
            sentence.syntaxTag(listPhrases, 'List');
        }

        return listPhrases;
    };

    Doc.prototype.verbPhrases = function () {
        let sentence = this;
        let verbs = sentence.verbs();

        return verbs;
    };

    Doc.prototype.adverbPhrases = function () {

    };

    Doc.prototype.nounPhrases = function () {
    // @Examples
    // street corner wonderlust
    // owner of a lonely heart
    // a yellow submarine

        let pos = 'Noun';
        let direction = 'backward';
        let head = '#Noun';
        let tail =
    [
        {term: '#Determiner', terminal: true, include: true},
        {term: '#Possessive', terminal: true, include: true},
        {term: '#Preposition', terminal: true, include: false},
        {term: '#Verb', terminal: true, include: false},
        {term: '#Adverb', terminal: false}
    ];

        let argObj = {pos: pos, head: head, tail: tail, direction: direction};

        return this.findPhrase (argObj);
    };


    Doc.prototype.gerundPhrases = function () {
        let pos = 'Gerund';
        let direction = 'forward';
        let head = '#Gerund';
        let tail = [
            {term: '#Noun', terminal: true, include: true}
        ];

        let argObj = {pos: pos, head: head, tail: tail, direction: direction};

        return this.findPhrase (argObj);
    };

    Doc.prototype.prepositionalPhrases = function () {
    // @Examples
    // of the turning away
    // of a thousand dances
    // in Cherry Hill Park
    // in a coalmine

        let pos = 'Preposition';
        let direction = 'forward';
        let head = '#Preposition';
        let tail =
      [
          {term: '#Noun', terminal: true, include: true},
          {term: '#Gerund', terminal: true, include: true},
          {term: '#Possessive', terminal: false},
          {term: '#Adverb', terminal: false}
      ];

        let argObj = {pos: pos, head: head, tail: tail, direction: direction};

        return this.findPhrase (argObj);
    };

    Doc.prototype.findPhrase = function (argumentsObj) {
        let pos = argumentsObj.pos;
        let head = argumentsObj.head;
        let tail = argumentsObj.tail;
        let direction = argumentsObj.direction;

        let sentence = this;
        let phrases = [];
        let strPhrases = [];

        // Find all instances of the POS type..
        let posFind = sentence.match(head);

        // Do theu form a phrase by ending in the requisite POS word?
        posFind.forEach(posTerm => {
            let posPhrase = empty;
            if (direction === 'backward') {
                posPhrase = sentence.phraseBackward(posTerm, tail);
            } else if (direction === 'forward') {
                posPhrase = sentence.phraseForward(posTerm, tail);
            }
            phrases.push(posPhrase);
        });

        strPhrases = phrases.NlpArrayToString();
        strPhrases = strPhrases.noSubDupes();

        // Convert back to NLP, tag 'em and bag 'em.
        let posPhraseTag = pos + 'Phrase';
        let posPhrases = sentence.mask(strPhrases);
        sentence.syntaxTag(posPhrases, posPhraseTag);

        return posPhrases;
    };

});
