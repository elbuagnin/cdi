import nlp from 'compromise';

nlp.extend((Doc, world) => { // eslint-disable-line
    const anything = '.';
    // const word = '.';
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

        let sentence = this;
        let proceed = true;
        let phrase = empty;
        let currentMatch = head;
        let tail = empty;
        let beginning = empty;

        while (proceed === true) {
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
                    if (sentence.after(tail.previous()).found) {
                        beginning = sentence.after(tail.previous());
                    } else {
                        beginning = sentence;
                    }

                } else {
                    beginning = sentence.after(tail);
                }

                if (beginning.before(head.next()).found) {
                    phrase = beginning.before(head.next());
                } else {
                    phrase = beginning;
                }
            }
        }

        return phrase;
    };

    Doc.prototype.phraseForward = function (head, tailSearchTerms) {
        let sentence = this;
        let proceed = true;
        let phrase = empty;
        let currentMatch = head;
        let tail = empty;
        let beginning = empty;

        while(proceed === true) {
            let include = false;
            let succeedingTerm = sentence.match(currentMatch).next();

            if (succeedingTerm.has(anything)) {

                tailSearchTerms.forEach(searchTerm => {

                    if (succeedingTerm.match(searchTerm.term).found) {

                        if (searchTerm.terminal === true) {
                            proceed = false;
                            tail = succeedingTerm;

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
                currentMatch = succeedingTerm;

            } else {

                if (include === true) {

                    if (sentence.before(tail.next()).found) {
                        beginning = sentence.before(tail.next());
                    } else {
                        beginning = sentence;
                    }
                }

                if (beginning.after(head.previous()).found) {
                    phrase = beginning.after(head.previous());
                }
                else {
                    phrase = beginning;
                }
            }
        }

        return phrase;
    };


    Array.prototype.noSubDupes = function () {
        // Eliminate phrases that are subphrases of other choices in an array.

        let array = this.reverse(); // Reversing is needed to spot subsets.

        for (let k = 0; k < 2; k++) {
            array.forEach((phrase, i) => {
                for (let j = 0; j < i ; j++) {
                    if (array[j].indexOf(array[i]) === 0) {
                        array.splice(i, 1);
                    }
                }
            });
        }
        return array.reverse();
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

    Doc.prototype.mask = function (segments) {

        let sentence = this;
        if (segments.length === 0) return;

        // Building a new Doc of the selected phrases.
        let negative = sentence.clone();
        let positive = sentence.clone();

        // Use segments strings to create a negative.
        segments.forEach(string => {
            negative = negative.split(string);
            negative.match(string).replaceWith(nothing);
        });

        // Use the negative to isolate the positive.
        negative.forEach(segment => {
            let remove = segment.text('reduced');
            positive.match(remove).replaceWith(nothing);

        });

        // Now split the phrases that remain.
        segments.forEach(string => {
            positive = positive.split(string);
        });

        return positive;
    };

    Doc.prototype.splitOnAround = function (on, around) {
        let sentence = this;

        let target = sentence.match(around);

        if (target.has(anything) === false) {
            return sentence.split(on);
        }

        let before = sentence.before(around).split(on);
        let after = sentence.after(around).split(on);

        let beforeExists = before.has(anything);
        let afterExists = after.has(anything);
        let build = [];
        let construction = empty;

        switch (beforeExists && afterExists) {
        case true:
            build.push( before.first(before.length-1) );
            build.push( before.last(1).append(target) ).append(after.first(1));
            build.push( after.last(after.length-1) );

            build.forEach (part => {
                construction = construction.concat(part);
            });

            return construction;
        case false:
            switch (beforeExists || afterExists) {
            case false:
                return target;
            case true:
                if (beforeExists) {
                    let a = before.first(before.length-1);
                    let b = before.last(1).append(target);
                    return a.concat(b);
                } else {
                    let a = target.append(after.first(1));
                    let b = after.last(after.length-1);
                    return a.concat(b);
                }
            }
        }
    };

    Doc.prototype.remove = function (segment) {
        let phrase = this();
        let string = segment.text();
        let remainder = phrase.clone();

        remainder.match(string).replaceWith(nothing);

        return remainder;
    };
});
