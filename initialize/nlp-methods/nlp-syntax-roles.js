import nlp from 'compromise';

// const nothing = '';
// let empty = nlp(nothing);

nlp.extend((Doc, world) => { // eslint-disable-line

    Doc.prototype.gerundRoles = function () {
        let segment = this;

        if (segment.has('#Gerund')) {
            let gerunds = segment.match('#Gerund');

            gerunds.forEach (gerund => {
                let copula = segment.match(gerund.text()).lookBehind('#Copula #Adverb?+').last();

                if (copula.found) {
                    let test = copula.append(gerund);

                    if (test.match('#Copula #Adverb?+ ' + gerund).found) {
                        gerund.tag('#SubjectComplement');
                        return '#SubjectComplement';
                    } else {
                        gerund.tag('#Verbal');
                        return '#Verbal';
                    }
                    
                } else {
                    gerund.tag('#Verbal');
                    return '#Verbal';
                }
            });
        }
    };


    Doc.prototype.textValueCardinalRole = function () {
        //
    };





});
