let TagName = class {
    constructor(name) {
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

    }

    tagName() {
        var introductor = false;
        var nameParts = this.nameParts();
        var numberOfParts = this.numberOfParts();

        this.hasEndDescriptor();
        introductor = this.hasBeginningDescriptor();

        // Reevaulate nameParts and numberOfParts to account for slicing.
        nameParts = this.nameParts();
        numberOfParts = this.numberOfParts();

        // Split up the this.name words & make decisions on what is what.
        switch(numberOfParts) {
            case 0: break;
            case 1:
                this.nameTags.firstName = this.name;
                break;
            case 2:
                if (introductor) {
                    this.nameTags.prefix = nameParts[0];
                    this.nameTags.descriptor = nameParts[1];
                    break;
                }
                if (this.nameTags.honorific) {
                    this.nameTags.prefix = nameParts[0];
                    this.nameTags.lastName = nameParts[1];
                } else if (this.nameTags.suffix) {
                    this.nameTags.firstName = nameParts[0];
                    this.nameTags.suffix = nameParts[1];
                } else {
                    this.nameTags.firstName = nameParts[0];
                    this.nameTags.lastName = nameParts[1];
                }
                break;
            case 3:
                if (introductor) {
                    this.nameTags.prefix = nameParts[0];
                    this.nameTags.descriptor = nameParts[1];
                    this.nameTags.lastName = nameParts[2];
                    break;
                }
                if (this.nameTags.honorific) {
                    this.nameTags.prefix = nameParts[0];
                    this.nameTags.firstName = nameParts[1];
                } else {
                    this.nameTags.firstName = nameParts[0];
                }
                if (this.nameTags.suffix) {
                    this.nameTags.suffix = nameParts[2];
                    this.nameTags.lastName = nameParts[1];
                } else {
                    this.nameTags.lastName = nameParts[2];
                }
                break;
            case 4:
                if (this.nameTags.honorific) {
                    this.nameTags.prefix = nameParts[0];
                    this.nameTags.firstName = nameParts[1];
                } else {
                    this.nameTags.firstName = nameParts[0];
                }
                if (this.nameTags.suffix) {
                    this.nameTags.suffix = nameParts[3];
                    this.nameTags.lastName = nameParts[2];
                } else {
                    this.nameTags.lastName = nameParts[3];
                }
                break;
            case 5:
                if (this.nameTags.honorific) {
                    this.nameTags.prefix = nameParts[0];
                    this.nameTags.firstName = nameParts[1];
                } else {
                    this.nameTags.firstName = nameParts[0];
                }
                if (this.nameTags.suffix) {
                    this.nameTags.suffix = nameParts[4];
                    this.nameTags.lastName = nameParts[3];
                } else {
                    this.nameTags.lastName = nameParts[4];
                }
                break;
        }

    }

    nameParts() {
        return (this.name.split(' '));
    }

    numberOfParts() {
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
        const honorifics = ['Mrs.', 'Mr.', 'Ms.', 'Dr.', 'Sir', 'Madam'];
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
        for (let i = 0; i < this.numberOfParts; i++) {   // default e.g. John, Mary Williams, The Hulk, The Great Gatsby
            this.nameTags.fullName += ' ' + this.nameParts[i];
        }
        if ((this.nameTags.honorific) && (this.numberOfParts > 2)) {   // honorific: leave is this.name has two parts. e.g. Mr. Williams
            this.nameTags.fullName = this.nameTags.fullName.slice(this.nameTags.honorific.length);
        }
        this.nameTags.fullName = this.nameTags.fullName.trim();
        if ((this.numberOfParts === 1) && (this.nameTags.descriptor)) {   // ending descriptors such as Andre the Giant
            this.nameTags.fullName = this.name + ' ' + this.nameTags.descriptor;
        }
    }
};

module.exports = async function tagName(name) {
    const nameTags = {
        fullName: '',
        firstName: '',
        middleName: '',
        lastName: '',
        honorific: '',
        prefix: '',
        suffix: '',
        descriptor: ''
    };

    var introductor = false;

    const honorifics = ['Mrs.', 'Mr.', 'Ms.', 'Dr.', 'Sir', 'Madam'];

    var nameParts = this.name.split(' ');
    var numberOfParts = nameParts.length;

    // Is there an informal descriptor at the end, such as "Lawrence the Axe?"
    if ((this.name.indexOf('the') !== -1) && (this.name.indexOf('the' !== 0))) {
        let position = this.name.indexOf('the');
        nameTags.descriptor = this.name.slice(position).trim();
        this.name = this.name.slice(0, position).trim();
    }

    //Is there an informal descriptor at the beginning, such as "The Fonz?"
    if (this.name.indexOf('The') === 0) { introductor = true; }

    // Is there an honorific, such as "Mrs.?"
    for (let i in honorifics) {
        if (this.name.indexOf(honorifics[i]) === 0) {
            nameTags.honorific = honorifics[i];
            break;
        }
    }

    // Reevaulate nameParts and numberOfParts to account for slicing.
    nameParts = this.name.split(' ');
    numberOfParts = nameParts.length;



    // Put the fullName together to return.
    for (let i = 0; i < numberOfParts; i++) {   // default e.g. John, Mary Williams, The Hulk, The Great Gatsby
        nameTags.fullName += ' ' + nameParts[i];
    }
    if ((nameTags.honorific) && (numberOfParts > 2)) {   // honorific: leave is this.name has two parts. e.g. Mr. Williams
        nameTags.fullName = nameTags.fullName.slice(nameTags.honorific.length);
    }
    nameTags.fullName = nameTags.fullName.trim();
    if ((numberOfParts === 1) && (nameTags.descriptor)) {   // ending descriptors such as Andre the Giant
        nameTags.fullName = this.name + ' ' + nameTags.descriptor;
    }

    return (nameTags);
};
