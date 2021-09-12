const http = require('http');

const requestListener = function (req, res) {
    res.writeHead(200);
    test();
    res.end('Hello, World!');
};

const server = http.createServer(requestListener);
server.listen(8080);

async function test() {
    const cdi = require ('./index');
    await cdi('Howard the Duck', 'Howard the Duck is a debonair fowl who parties hard. He ain\'t no chimp!');
    await cdi('Conan', 'Conan is a killer. Conan wields a big great sword. Conan is muscular. Conan kills!');
    await cdi('Fafhrd', 'Fafhrd is a barbarian from the frozen North. He is a skilled sailor and mountain-climber.');
    await cdi('Gray Mouser', 'A sneaky thief, if I ever knew one. He is skilled in black magic too!');
    await cdi('Tansy Goodfellow', 'Tansy is a hedge wizard from the Southern Forest.');
    await cdi('Alyx the Pickpocket', 'Alyx is a female thief who is tolerated by the all-mail Thieves\'s Guild.');
    await cdi('Moorph','Moorph is a Mingol Horseman from the Steppes.');
    await cdi('Andre the Giant', 'Andre the Giant is the brute squad and a fabulous poet.');
    await cdi('Inigo Montoya', 'A down-and-out, expert swordsman waiting for the six-fingered man, so that he can avenge his father.');
    await cdi('Zlarzar', 'He is a warrior from the Land of the Eight Cities. He uses an axe.');
    await cdi('Mist','Mist: A young human female, her hair is grayish-blonde. Her usual appearance- her tied back in a messy knot, wearing a long black robe, in the night she will look like a shadow. When there is anything of a festive going on, she lets her hair go free; it reaches just past her shoulders, and is rather wavy. under her black cloth she wears a jade green dress which is strapless, and rather long as well. Mist rarely smiles, but when she does, it\'s true. She was raised in the mountains, and swears by the ledgends her parents told her. She\'s one of the children of nature, who can live together with creatures like dragons, unicorns, griffons and so on. She used to ride a copper dragon, Lae, which died of a lousy infection. Her father died when she was very young, and left her the dragon Lae. her mother died a few years later, and Mist was left to look at her two younger brothers. She went away on travel to prove herself, but doesn\'t really succeed - she can\'t even win a drinking contest from an elf.');
    await cdi('Joseph Zimmerman','Standing 5\'6 and weighing 150lbs, his arms and legs and other exposed parts of his are a dark tan from the service that he has given, but his natural skin color, which could still be seen on some of the underside of the inside of his arms and legs, is significantly lighter. He has black hair which he makes neat when he can, but otherwise accepts when it has to be in a mess and brown eyes, with a scar close to his right eye from his first fight. While he is more muscular than most artificers he is very lean compared to most in the army. Unlike most in his position, he prefers to wield a well-made light crossbow, regular bows and swords always having been unwieldily to him. He carries a backpack at all times, filled with a couple of scrolls and potions that he finds more interesting loose, and more in a box locked with a combination lock at the bottom of his backpack with the remainder of them knowing that it would be foolish to have all of his supplies open for everyone to get.');
    await cdi('Dakkon "The Scholar"','Dakkon possesses the same plain looks that his family is known for. He is passably attractive though won’t woo the hearts of the finest ladies with his looks. If they woo, it will be his intellect and his character that sets their hearts aflutter. Dakkon stands at a comfortable 6’1” and the intense training he received from his mentor, Scarbo, and his time with the rank and file, has turned the 190 lbs. he carries around into a commendable bit of muscle. He keeps his brown hair shorn short; a soldier’s cut. His light-gray eyes betray a curiosity that seems unquenchable and a vast intelligence. Despite his youth, Dakkon appears a seasoned veteran, a man with experience, and carries himself with the poise of a leader.');
    await cdi('Wolfeknight','name: wolfeknight\nage: 17 or 1 and two quarters in dog years' +
        'race: Wurwolf (wolf-like people from ancient germanic tribes)\npath:Rogue' +
        'likes: bacon, cupcakes and annoying the carp outta people, the moon.\n' +
        'dislikes: laser pointers, spiders, muffins, the number 7 and being trapped in houses\n' +
        'describition:5 foot 2, with grey fur and hair, skinny.\n' +
        'momentos: his mother\'s battle helm (although it doesn\'t fit) a moon pendant (which was also his mothers) and a bone bracelet made for him by his love.' +
        'eye color:hazel\n' +
        'backstory: always the runt of the litter with something to prove, with a pention of starting trouble with higher ups while in fight one day lost his eye due to a foul stroke by his opponent scared, bleeding and franticly trying to get away a mystical portal opened up beneath him sending him here upon which his enemy could not enter. thankful for his safety he begun to look around him finding this world was inhabited by people as many structures had been built. he began exploring and' + 'finding with each passing night creature he killed he grew stronger and learnt new things some say if your lucky you\'ll find him exploring.');
    await cdi('Largo','\nEdit\n\n8\'1" About 360 lbs. -All muscle\n\nAlways has weapon drawn\n\n    Carries it over his shoulder\n    I\'ll get you one of my sketches\n\nArms and face are ceremonially scarred (claw marks)\n\n    Makes him look frightening but not ugly\n    Face: 2 claw marks (Upper Left > Bottom Right, Upper Right > Bottom Left)\n\nArms wrapped in blood-stained linen bandages, desert nomad style\n\nLarge sharpened canines (now steel reinforced)\n\nPale blue eyes: kind of sad, kind of crazy\n\nLong spiky black hair\n\n    Small spikes, down to center of his back\n    Don\'t forget the crown!\n\nShort sleeved armor (Steel breastplate w/ lion motif in center)\n\nTan skin, not too dark\n\nBrass earring on left ear\n\nBone whistle around neck w/ small silver dancer charm attached ');
    await cdi('Dax','    Height: 5\'11"\n    Weight: 175 lbs.\n    Very lanky, built like me, only Solar.\n    Violet hair, in shoulder-length dreadlocks.\n    Face shaped something like home plate. Narrow, begins to taper at cheekbones, comes to point at chin.\n    Medium-length goatee, localized to chin. Sideburns down to jawline.\n    Large, wide, seafoam green eyes. Sarcastic, slightly calculating gaze; one eyebrow slightly raised at all times - ever vigilant, yet searching for humor in all circumstances.\n    Long, bony, but muscular hands. Extremely dexterous, but capable of unequaled grace and strength (except perhaps Largo\'s, whose hands far surpass Dax\'s in strength and size, but not quite in grace). Skinny fingers allow access into tiny places, such as pockets and traps.\n    Midnight blackish-blue robes, resembling that of ancient far-east martial artists, but with a more modern feel. Full of hidden pockets.\n    Utility belt around waist, contains many pockets, pouches, and loops for all the various tools and equipment he carries. Mostly hidden beneath cloak, however.\n    Grayish cloak, shifting slightly in color to blend in with surroundings. Tattered purposely, for purely aesthetic purposes. Flows perpetually about Dax, helping to conceal his true form, and any equipment he carries.');
    await cdi('Istari the Avid','Istari is a devout follower of Issek of the Jug.');
    // var doc = metaDoc['doc'];
    // console.log(doc);
    //
    // console.log(doc.out('tags'));


}
