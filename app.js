const http = require('http');
const fs = require('fs');

const requestListener = function (req, res) {
    res.writeHead(200);
    test();
    res.end('Hello, World!');
};

const server = http.createServer(requestListener);
server.listen(8080);

async function test() {
    const name = 'Dax';
    const text = '';

    fs.readFile('./sample.txt', 'utf8', (err, data) => {
         if (err) {
            console.err(err);
            return;
         }
         text = data;
    });

    const cdi = require ('./index');
    cdi(name, text);
}
