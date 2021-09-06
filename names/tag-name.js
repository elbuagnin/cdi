module.exports = async function tagName(name) {
    const nameData = {
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

    var nameParts = name.split(' ');
    var numberOfParts = nameParts.length;

    // Is there an informal descriptor at the end, such as "Lawrence the Axe?"
    if ((name.indexOf('the') !== -1) && (name.indexOf('the' !== 0))) {
        let position = name.indexOf('the');
        nameData.descriptor = name.slice(position).trim();
        name = name.slice(0, position).trim();
    }

    //Is there an informal descriptor at the beginning, such as "The Fonz?"
    if (name.indexOf('The') === 0) { introductor = true; }

    // Is there an honorific, such as "Mrs.?"
    for (let i in honorifics) {
        if (name.indexOf(honorifics[i]) === 0) {
            nameData.honorific = honorifics[i];
            break;
        }
    }

    // Reevaulate nameParts and numberOfParts to account for slicing.
    nameParts = name.split(' ');
    numberOfParts = nameParts.length;

    // Split up the name words & make decisions on what is what.
    switch(numberOfParts) {
        case 0: break;
        case 1:
            nameData.firstName = name;
            break;
        case 2:
            if (introductor) {
                nameData.prefix = nameParts[0];
                nameData.descriptor = nameParts[1];
                break;
            }
            if (nameData.honorific) {
                nameData.prefix = nameParts[0];
                nameData.lastName = nameParts[1];
            } else if (nameData.suffix) {
                nameData.firstName = nameParts[0];
                nameData.suffix = nameParts[1];
            } else {
                nameData.firstName = nameParts[0];
                nameData.lastName = nameParts[1];
            }
            break;
        case 3:
            if (introductor) {
                nameData.prefix = nameParts[0];
                nameData.descriptor = nameParts[1];
                nameData.lastName = nameParts[2];
                break;
            }
            if (nameData.honorific) {
                nameData.prefix = nameParts[0];
                nameData.firstName = nameParts[1];
            } else {
                nameData.firstName = nameParts[0];
            }
            if (nameData.suffix) {
                nameData.suffix = nameParts[2];
                nameData.lastName = nameParts[1];
            } else {
                nameData.lastName = nameParts[2];
            }
            break;
        case 4:
            if (nameData.honorific) {
                nameData.prefix = nameParts[0];
                nameData.firstName = nameParts[1];
            } else {
                nameData.firstName = nameParts[0];
            }
            if (nameData.suffix) {
                nameData.suffix = nameParts[3];
                nameData.lastName = nameParts[2];
            } else {
                nameData.lastName = nameParts[3];
            }
            break;
        case 5:
            if (nameData.honorific) {
                nameData.prefix = nameParts[0];
                nameData.firstName = nameParts[1];
            } else {
                nameData.firstName = nameParts[0];
            }
            if (nameData.suffix) {
                nameData.suffix = nameParts[4];
                nameData.lastName = nameParts[3];
            } else {
                nameData.lastName = nameParts[4];
            }
            break;
    }

    // Put the fullName together to return.
    for (let i = 0; i < numberOfParts; i++) {   // default e.g. John, Mary Williams, The Hulk, The Great Gatsby
        nameData.fullName += ' ' + nameParts[i];
    }
    if ((nameData.honorific) && (numberOfParts > 2)) {   // honorific: leave is name has two parts. e.g. Mr. Williams
        nameData.fullName = nameData.fullName.slice(nameData.honorific.length);
    }
    nameData.fullName = nameData.fullName.trim();
    if ((numberOfParts === 1) && (nameData.descriptor)) {   // ending descriptors such as Andre the Giant
        nameData.fullName = name + ' ' + nameData.descriptor;
    }

    return (nameData);
};
