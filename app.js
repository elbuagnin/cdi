const http = require('http');

const requestListener = function (req, res) {
    res.writeHead(200);
    test();
    res.end('Hello, World!');
};

const server = http.createServer(requestListener);
server.listen(8080);

async function test() {
    const name = '';
    const text = '';

    const cdi = require ('./index');
    await cdi(name, text);
}
