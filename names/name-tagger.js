module.exports = class NameTagger {
    constructor(name, doc) {
        this.doc = doc;
        this.name = name;
        this.nameTags = {
            fullName: '',
            firstName: '',
            middleName: '',
            lastName: '',
            honorific: '',
            prefix: '',
            suffix: '',
            descriptor: ''
        };
        this.nameParts = []; // The individual words of a name.
        this.numberOfParts = 0; // How many words are in the name.

        // Do the work
        this.assignNameTags();
        this.writeToDoc();

    }

    writeToDoc() {
        for (let tag in this.nameTags) {
            let word = this.doc.match(this.nameTags[tag]);
            word.tag(tag);

            // Add 'principal' tag to names.
            switch (tag) {
                case 'fullName':
                    word.tag('Principal');
                    break;
                case 'firstName':
                    word.tag('Principal');
                    break;
                case 'lastName':
                    word.tag('Principal');
                    break;
            }
        }
    }

    assignNameTags() {
        var introductor = false; // Segment that introduces a name. Descriptors that are not an Honorific.

        // Look for informal discriptors on the name such as [The] Hulk or Andre [the Giant].
        this.hasEndDescriptor();
        introductor = this.hasBeginningDescriptor();

        // Get nameParts and numberOfParts here to account for slicing.
        this.nameParts = this.whatAreTheNameParts();
        this.numberOfParts = this.howManyNameParts();

        // Split up the this.name words & make decisions on what is what.
        switch(this.numberOfParts) {
            case 0: break;
            case 1:
                this.nameTags.firstName = this.name;
                break;
            case 2:
                if (introductor) {
                    this.nameTags.prefix = this.nameParts[0];
                    this.nameTags.descriptor = this.nameParts[1];
                    break;
                }
                if (this.nameTags.honorific) {
                    this.nameTags.prefix = this.nameParts[0];
                    this.nameTags.lastName = this.nameParts[1];
                } else if (this.nameTags.suffix) {
                    this.nameTags.firstName = this.nameParts[0];
                    this.nameTags.suffix = this.nameParts[1];
                } else {
                    this.nameTags.firstName = this.nameParts[0];
                    this.nameTags.lastName = this.nameParts[1];
                }
                break;
            case 3:
                if (introductor) {
                    this.nameTags.prefix = this.nameParts[0];
                    this.nameTags.descriptor = this.nameParts[1];
                    this.nameTags.lastName = this.nameParts[2];
                    break;
                }
                if (this.nameTags.honorific) {
                    this.nameTags.prefix = this.nameParts[0];
                    this.nameTags.firstName = this.nameParts[1];
                } else {
                    this.nameTags.firstName = this.nameParts[0];
                }
                if (this.nameTags.suffix) {
                    this.nameTags.suffix = this.nameParts[2];
                    this.nameTags.lastName = this.nameParts[1];
                } else {
                    this.nameTags.lastName = this.nameParts[2];
                }
                break;
            case 4:
                if (this.nameTags.honorific) {
                    this.nameTags.prefix = this.nameParts[0];
                    this.nameTags.firstName = this.nameParts[1];
                } else {
                    this.nameTags.firstName = this.nameParts[0];
                }
                if (this.nameTags.suffix) {
                    this.nameTags.suffix = this.nameParts[3];
                    this.nameTags.lastName = this.nameParts[2];
                } else {
                    this.nameTags.lastName = this.nameParts[3];
                }
                break;
            case 5:
                if (this.nameTags.honorific) {
                    this.nameTags.prefix = this.nameParts[0];
                    this.nameTags.firstName = this.nameParts[1];
                } else {
                    this.nameTags.firstName = this.nameParts[0];
                }
                if (this.nameTags.suffix) {
                    this.nameTags.suffix = this.nameParts[4];
                    this.nameTags.lastName = this.nameParts[3];
                } else {
                    this.nameTags.lastName = this.nameParts[4];
                }
                break;
        }

        this.nameTags.fullName = this.getFullName();
    }

    whatAreTheNameParts() {
        return ([this.name.split(' ')]);
    }

    howManyNameParts() {
        return (this.nameParts.length);
    }

    hasEndDescriptor() {
        // Is there an informal descriptor at the end, such as "Lawrence the Axe?"
        if ((this.name.indexOf('the') !== -1) && (this.name.indexOf('the' !== 0))) {
            let position = this.name.indexOf('the');
            this.nameTags.descriptor = this.name.slice(position).trim();
            this.name = this.name.slice(0, position).trim();
            return true;
        }

        return false;
    }

    hasBeginningDescriptor() {
        //Is there an informal descriptor at the beginning, such as "The Fonz?"
        if (this.name.indexOf('The') === 0) { return true; }
    }

    hasHonorific() {
        // Is there an honorific, such as "Mrs.?"
        const honorifics = ['Mrs.', 'Mr.', 'Ms.', 'Dr.', 'Sir', 'Madam', 'Doctor'];
        for (let i in honorifics) {
            if (this.name.indexOf(honorifics[i]) === 0) {
                this.nameTags.honorific = honorifics[i];
                return true;
            }
        }

        return false;
    }

    getFullName() {
        // Put the fullName together to return.
        // For the purposes of RPG characters, if only a single name is provided, i.e. Sting, then this method will assign
        // Sting as a fullName.
        for (let i = 0; i < this.numberOfParts; i++) {   // default e.g. John, Mary Williams, The Hulk, The Great Gatsby
            this.nameTags.fullName += ' ' + this.nameParts[i];
        }
        if ((this.nameTags.honorific) && (this.numberOfParts > 2)) {   // honorific: leave if this.name has two parts. e.g. Dr. Strange.
            this.nameTags.fullName = this.nameTags.fullName.slice(this.nameTags.honorific.length);
        }
        this.nameTags.fullName = this.nameTags.fullName.trim();
        if ((this.numberOfParts === 1) && (this.nameTags.descriptor)) {   // ending descriptors such as Andre the Giant
            this.nameTags.fullName = this.name + ' ' + this.nameTags.descriptor;
        }
    }
};
