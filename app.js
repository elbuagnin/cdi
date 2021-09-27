import http from 'http';
import fs from 'fs';
import cdi from './index.js';
var text = '';

const requestListener = function (req, res) {
    res.writeHead(200);
    test();
    res.end('Hello, World!');
};

const server = http.createServer(requestListener);
server.listen(8080);

async function test() {
    const name = 'Dax';

    fs.readFile('./sample.txt', 'utf8', (err, data) => {
         if (err) {
            console.err(err);
            return;
         }
         text = data;
    });

    cdi(name, text);
}
