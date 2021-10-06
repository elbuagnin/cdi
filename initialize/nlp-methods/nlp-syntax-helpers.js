import nlp from 'compromise';

nlp.extend((Doc, world) => { // eslint-disable-line
    const anything = '.';
    //    const word = '.';
    const nothing = '';
    const empty = nlp(nothing);

    Doc.prototype.previous = function () {
        let precedingWords = this.all().before(this);
        let precedingWord = precedingWords.lastTerms();

        if (precedingWord.found) {
            return precedingWord;
        } else return this.match(nothing);
    };


    Doc.prototype.next = function () {
        let succeedingWords = this.all().after(this);
        let succeedingWord = succeedingWords.firstTerms();

        if (succeedingWord.found) {
            return succeedingWord;
        } else return this.match(nothing);
    };


    Doc.prototype.phraseBackward = function (head, tailSearchTerms) {
        /* Development Options */
        let devBlockName = 'phraseBackward'; // eslint-disable-line
        let devInfoOn = false; // eslint-disable-line
        devBlock('phraseBackward', devInfoOn); // eslint-disable-line
        /***********************/
        devInfo(head, 'head', devInfoOn, devBlockName); // eslint-disable-line

        let sentence = this.all();
        let proceed = true;
        let phrase = empty;
        let currentMatch = head;
        let tail = empty;
        let beginning = empty;

        while(proceed === true) {
            let include = false;
            let preceedingTerm = sentence.match(currentMatch).previous();

            if (preceedingTerm.has(anything)) {
                tailSearchTerms.forEach(searchTerm => {
                    if (preceedingTerm.match(searchTerm.term).found) {
                        if (searchTerm.terminal === true) {
                            proceed = false;
                            tail = preceedingTerm;
                            if (searchTerm.include === true) {
                                include = true;
                            }
                        } else {
                            proceed = true;
                        }
                    }
                });
            } else {
                proceed = false;
            }

            if (proceed) {
                currentMatch = preceedingTerm;

            } else {

                if (include === true) {
                    if (tail.previous().found) {
                        beginning = sentence.after(tail.previous());
                    } else {
                        beginning = sentence;
                    }
                }

                if (head.next().found) {
                    phrase = beginning.before(head.next());
                }
                else {
                    phrase = beginning;
                }
            }
        }

        return phrase;
    };


    Doc.prototype.phraseForward = function (head, tailSearchTerms) {
        let sentence = this.all();
        let currentMatch = head;
        let tail = head;
        let phrase = this.all(nothing);
        let proceed = true;

        while(proceed === true) {
            let include = false;
            let succeedingTerm = sentence.match(currentMatch).next();

            if (succeedingTerm.has(anything)) {
                tailSearchTerms.forEach(rule => {
                    if (succeedingTerm.has(rule.tag)) {
                        proceed = false;
                        include = rule.include;
                    }
                });
            } else {
                proceed = false;
            }

            if (proceed) {
                currentMatch = succeedingTerm;
                tail = currentMatch;
            } else {
                currentMatch = false;
                if (include === true) {
                    tail = succeedingTerm;
                }
            }

            phrase = sentence.splitBefore(head);
            phrase = phrase.splitAfter(tail);
        }

        return phrase;
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
        let devInfoOn = true;
        devBlock('stringArrayToNlp', devInfoOn, devBlockName); // eslint-disable-line
        /***********************/

        let array = this;
        if (array.length === 0) return;

        // Building a new Doc of the selected phrases.
        let negative = sentence.clone();
        let positive = sentence.clone();

        // Use array strings to create a negative.
        array.forEach(string => {
            negative = negative.splitAfter(string);
            negative.match(string).replaceWith(nothing);
        });
        devInfo(negative, 'negative', devInfoOn, devBlockName); // eslint-disable-line
        // Use the negative to isolate the positive.
        negative.forEach(segment => {
            let remove = segment.text();
            positive.match(remove).replaceWith(nothing);
        });
        devInfo(positive, 'positive', devInfoOn, devBlockName); // eslint-disable-line
        // Now split the phrases that remain.
        array.forEach(string => {
            positive = positive.splitBefore(string);
            positive = positive.splitAfter(string);
        });

        return positive;
    };

    Doc.prototype.remove = function (segment) {
        let phrase = this.all();
        let string = segment.text();
        let remainder = phrase.clone();

        remainder.match(string).replaceWith(nothing);

        return remainder;
    };
});
