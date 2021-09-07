const http = require('http');

const requestListener = function (req, res) {
  res.writeHead(200);
  test();
  res.end('Hello, World!');
}

const server = http.createServer(requestListener);
server.listen(8080);

async function test() {
    const cdi = require ('./index');
    const findCareers = require('./careers/find-careers');
    const metaDoc = await cdi('Howard the Duck', 'Howard the Duck is a debonair fowl who parties hard. He ain\'t no chimp!');
    console.log(metaDoc);

    var doc = metaDoc['doc'];
    console.log(doc);

    console.log(doc.out('tags'));

    const careers = findCareers(doc);

}
