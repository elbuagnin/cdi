module.exports = class grammar {
    constructor (doc) {
        this.doc = doc;
        this.glp = require('grandiloquent');
        this.nlp = require('compromise');

        this.sentence = this.doc;
    }

    isCompleteSentence () {
        if (this.getMainClause) {
            return true;
        } else {
            return false;
        }
    }

    getSubject () {
        let subject = this.glp.sentence.getSubjectPhrase().toString();
        return subject.word;
    }

    getMainVerb () {
        let mainVerb = this.glp.sentence.getMainVerb().toString();
        return mainVerb.word;
    }

    getMainClause () {
        let mainClause = this.glp.sentence.getSubjectVerbPhrase().toString();
        return mainClause.word;
    }
};
