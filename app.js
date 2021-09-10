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
    // var doc = metaDoc['doc'];
    // console.log(doc);
    //
    // console.log(doc.out('tags'));


}
