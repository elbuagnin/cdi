import nlp from 'compromise';

nlp.extend((Doc, world) => { // eslint-disable-line
    const anything = '.';
    const nothing = '';

    Doc.prototype.justBefore = function () {
        /* Development Options */
      let devBlockName = 'justBefore'; // eslint-disable-line
      let devInfoOn = false; // eslint-disable-line
      devBlock('justBefore', devInfoOn); // eslint-disable-line
        /***********************/

        let precedingWords = this.parent().before(this);
        let precedingWord = precedingWords.lastTerms();

        if (precedingWord.found) {
            return precedingWord;
        } else return this.match('');
    };

    Doc.prototype.justAfter = function () {
        /* Development Options */
      let devBlockName = 'justAfter'; // eslint-disable-line
      let devInfoOn = false; // eslint-disable-line
      devBlock('justAfter', devInfoOn); // eslint-disable-line
        /***********************/

        let succeedingWords = this.parent().after(this);
        let succeedingWord = succeedingWords.firstTerms();

        if (succeedingWord.found) {
            return succeedingWord;
        } else return this.match('');
    };

    Doc.prototype.phraseBackward = function (head, tail) {
        /* Development Options */
      let devBlockName = 'phraseBackward'; // eslint-disable-line
      let devInfoOn = false; // eslint-disable-line
      devBlock('phraseBackward()', devInfoOn); // eslint-disable-line
        /***********************/
        let sentence = this;
        let phrase = head.text();
        let currentMatch = head.text();
        let proceed = true;

        while(proceed === true) {
            let includeTerm = false;
            let preceedingTerm = sentence.match(currentMatch).justBefore();

            if (preceedingTerm.has(anything)) {
               devInfo(preceedingTerm, 'preceedingTerm', devInfoOn, devBlockName); // eslint-disable-line
                tail.forEach(rule => {
                    if (preceedingTerm.has(rule.tag)) {
                        proceed = false;
                        includeTerm = rule.include;
                    }
                });
            } else {
                proceed = false;
            }

            if (proceed) {
                currentMatch = preceedingTerm;
                phrase = currentMatch.text() + ' ' + phrase;
            } else {
                currentMatch = false;
                if (includeTerm === true) {
                    phrase = preceedingTerm.text() + ' ' + phrase;
                }
            }
        }

        let nlpPhrase = sentence.match(phrase);
        return nlpPhrase;
    };

    Doc.prototype.phraseForward = function (head, tail) {
        /* Development Options */
      let devBlockName = 'phraseForward'; // eslint-disable-line
      let devInfoOn = false; // eslint-disable-line
      devBlock('phraseForward()', devInfoOn); // eslint-disable-line
        /***********************/

        let sentence = this;
        let phrase = head.text();
        let currentMatch = head.text();
        let proceed = true;

        while(proceed === true) {
            let includeTerm = false;
            let succeedingTerm = sentence.match(currentMatch).justAfter();

            if (succeedingTerm.has(anything)) {
                tail.forEach(rule => {
                    if (succeedingTerm.has(rule.tag)) {
                        proceed = false;
                        includeTerm = rule.include;
                    }
                });
            } else {
                proceed = false;
            }

            if (proceed) {
                currentMatch = succeedingTerm;
                phrase = phrase + ' ' + currentMatch.text();
            } else {
                currentMatch = false;
                if (includeTerm === true) {
                    phrase = phrase + ' ' + succeedingTerm.text();
                }
            }
        }

        let nlpPhrase = sentence.match(phrase);
        return nlpPhrase;
    };

    Array.prototype.noSubDupes = function () {
        // Eliminate phrases that are subphrases of other choices in an array.

        let array = this;

        for (let k = 0; k < 2; k++) {
            array.forEach((phrase, i) => {
                for (let j = 0; j < i ; j++) {
                    if (array[j].indexOf(array[i]) === 0) {
                        array.splice(i, 1);
                    }
                }
            });
        }
        return array;
    };

    // Generates unique IDs for by Tag.
    const tagIDs = {};
    function* generateID (tag) {
        if (tag in tagIDs) {
            tagIDs[tag]++;
        } else {
            tagIDs[tag] = 0;
        }

        yield tag + tagIDs[tag];
    }

    Doc.prototype.syntaxTag = function (segments, tag) {
        if (!segments) return;

        segments.forEach (item => {
            // Tag with syntax tag and unique id.
            let id = generateID(tag).next().value;

            // Tag original sentence.
            this.match(item.text()).tag(tag);
            this.match(item.text()).tag(id);
            // Tag segment copies sent in args.
            item.tag(tag);
            item.tag(id);
        });
    };

    Array.prototype.NlpArrayToString = function () {
        let array = this;
        let newArray = [];

        array.forEach(member => {
            let string = member.text();
            newArray.push(string);
        });

        return newArray;
    };

    Array.prototype.stringArrayToNlp = function (sentence) {
        /* Development Options */
        let devBlockName = 'stringArrayToNlp';
        let devInfoOn = false;
        devBlock('stringArrayToNlp', devInfoOn, devBlockName); // eslint-disable-line
        /***********************/

        let array = this;
        if (array.length === 0) return;

        // Building a new Doc of the selected phrases.
        let negative = sentence.clone();
        let positive = sentence.clone();

        // Use array strings to create a negative.
        array.forEach(string => {
            negative.match(string).replaceWith(nothing);
        });

        // Use the negative to isolate the positive.
        negative.forEach(segment => {
            let remove = segment.text();
            positive.match(remove).replaceWith(nothing);
        });

        // Now split the phrases that remain.
        array.forEach(string => {
            positive = positive.splitBefore(string);
            positive = positive.splitAfter(string);
        });

        return positive;
    };
});
