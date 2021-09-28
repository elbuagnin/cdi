export default function nlpTagName (doc, name) {

    let nameTags = assignNameTags(name);
    writeToDoc (doc, nameTags);
    return nameTags;

    function writeToDoc(doc, nameTags) {
        for (let tag in nameTags) {
            let word = doc.match(nameTags[tag]);
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

    function assignNameTags(name) {
        let nameTags = {};

        // Look for informal discriptors on the name such as [The] Hulk or Andre [the Giant].
        // Honorifics such as Mrs. or Dr.
        // Suffixes such as Jr. or Ph.D
        nameTags.postDescriptor = hasPostDescriptor(name);
        let introductor = hasPreDescriptor(name);
        let honorific = hasHonorific(name);
        let suffix = hasSuffix(name);

        // Get nameParts and numberOfParts here to account for slicing.
        let nameParts = whatAreTheNameParts(name);
        let numberOfParts = howManyNameParts(nameParts);
        let nameData = {
            nameParts: nameParts,
            numberOfParts: numberOfParts
        };

        // Split up the name words & make decisions on what is what.
        switch(numberOfParts) {

        case 0: break;
        case 1:
            // Hank
            nameTags.firstName = name;
            break;
        case 2:
            if (introductor) {
                // The Fonz
                nameTags.prefix = nameParts[0];
                nameTags.descriptor = nameParts[1];
                break;
            }
            if (honorific) {
                // Miss Marple
                nameTags.prefix = nameParts[0];
                nameTags.lastName = nameParts[1];
            } else if (nameTags.suffix) {
                // Carl Jr.
                nameTags.firstName = nameParts[0];
                nameTags.suffix = nameParts[1];
            } else {
                // Hank Hill
                nameTags.firstName = nameParts[0];
                nameTags.lastName = nameParts[1];
            }
            break;
        case 3:
            if (introductor) {
                // The Big Lebowski
                nameTags.prefix = nameParts[0];
                nameTags.descriptor = nameParts[1];
                nameTags.lastName = nameParts[2];
                break;
            }
            if (honorific) {
                // Professor Minerva
                nameTags.prefix = nameParts[0];
                nameTags.firstName = nameParts[1];
            } else {
                // Briscoe
                nameTags.firstName = nameParts[0];
            }
            if (suffix) {
                // County Jr.
                nameTags.suffix = nameParts[2];
                nameTags.lastName = nameParts[1];
            } else {
                // McGonagall
                nameTags.lastName = nameParts[2];
            }
            break;
        case 4:
            if (honorific) {
                nameTags.prefix = nameParts[0];
                nameTags.firstName = nameParts[1];
            } else {
                nameTags.firstName = nameParts[0];
            }
            if (suffix) {
                nameTags.suffix = nameParts[3];
                nameTags.lastName = nameParts[2];
            } else {
                nameTags.lastName = nameParts[3];
            }
            break;
        case 5:
            if (honorific) {
                nameTags.prefix = nameParts[0];
                nameTags.firstName = nameParts[1];
            } else {
                nameTags.firstName = nameParts[0];
            }
            if (suffix) {
                nameTags.suffix = nameParts[4];
                nameTags.lastName = nameParts[3];
            } else {
                nameTags.lastName = nameParts[4];
            }
            break;
        }

        nameTags.fullname = determineFullName(name, nameTags, nameData);

        return nameTags;
    }

    function whatAreTheNameParts(name) {
        return ([name.split(' ')]);
    }

    function howManyNameParts(nameParts) {
        return (nameParts.length);
    }

    function hasPostDescriptor(name) {
        // Is there an informal descriptor at the end, such as "Andre the Giant?"
        let postDescriptor = '';

        if ((name.indexOf('the') !== -1) && (name.indexOf('the' !== 0))) {
            let position = name.indexOf('the');
            postDescriptor = name.slice(position).trim();
            name = name.slice(0, position).trim();

            return postDescriptor;
        }

        return false;
    }

    function hasPreDescriptor(name) {
        //Is there an informal descriptor at the beginning, such as "The Fonz?"
        if (name.indexOf('The') === 0) {
            return true;
        } else {
            return false;
        }
    }

    function hasHonorific() {
        const personal = ['Mrs.', 'Mr.', 'Ms.', 'Mx.', 'Madam', 'Mister', 'Master', 'Mistress', 'Misses'];
        const professional = [ 'Dr.', 'Doctor'];
        const religious = ['Father', 'Pastor', 'Brother', 'Sister', 'Chaplain', 'Cardinal', 'Bishop'];
        const titled = ['Sir', 'Dame', 'Lord', 'Lady'];
        const academic = ['Prof.', 'Professor', 'Principal', 'Chancellor', 'Vice-Chancellor',
            'Warden', 'Dean', 'Regent', 'Rector', 'Provost'];
        const military = ['Private', 'Pvt.', 'Corporal', 'Cpl.', 'Sergeant', 'Sgt.', 'Lieutenant', 'Lt.',
            'Captain', 'Cpt.', 'Major', 'Maj.', 'Colonel', 'Col.', 'General', 'Gen.',
            'Seaman', 'Petty Officer', 'Warrant Officer', 'Ensign', 'Commander', 'Cdr.',
            'Rear Admiral', 'Admiral', 'Lance Corporal', 'Gunnery Sergeant', 'Master Sergeant',
            'MSgt.', 'Sergeant Major', 'SgtMaj', 'Brigadier General'];
        const honorifics = [...personal, ...professional, ...religious, ...titled, ...academic];
        let honorific = '';

        honorifics.forEach (honorificOption => {
            if (name.indexOf(honorificOption) === 0) {
                honorific = honorificOption;
                return honorific;
            } else if (honorificOption.indexOf('.') === -1) {
                if (name.indexOf(honorificOption.slice(0, -2))) {
                    honorific = honorificOption;
                    return honorific;
                }
            }
        });

        return false;
    }

    function hasSuffix (name) {
        const generational = ['Jr.', 'Sr.', 'the Third'];
        const professional = ['MD', 'M.D.', 'DVM', 'Ph.D', 'RN', 'J.P.', 'Esquire', 'Esq.'];
        const honorary = ['OBE', 'CBE'];
        const suffixes = [...generational, ...professional, ...honorary];
        let suffix = '';

        for (let i in suffixes) {
            if (name.indexOf(suffixes[i]) === 0) {
                suffix = suffixes[i];
                return suffix;
            }
        }

        return false;
    }

    function determineFullName(name, nameTags, nameData) {
        // Put the fullName together to return.
        // For the purposes of RPG characters, if only a single name is provided.
        // i.e. Sting, then this method will assign Sting as a fullName.

        let fullName = '';

        for (let i = 0; i < nameData.numberOfParts; i++) {   // default e.g. John, Mary Williams, The Hulk, The Great Gatsby
            fullName += ' ' + nameData.nameParts[i];
        }
        if ((nameTags.honorific) && (nameData.numberOfParts > 2)) {   // honorific: leave if name has two parts. e.g. Dr. Strange.
            fullName = nameTags.fullName.slice(nameTags.honorific.length);
        }
        nameTags.fullName = nameTags.fullName.trim();
        if ((nameData.numberOfParts === 1) && (nameTags.postDescriptor)) {   // ending descriptors such as Andre the Giant
            fullName = name + ' ' + nameTags.postDescriptor;
        }

        return fullName;
    }
}
