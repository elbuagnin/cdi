import http from "http";
import { readFile } from "fs";
import nlp from "compromise";
import cdi from "./index.js";
var text = "";

nlp.plugin(cdi);
const primeTheEngine = nlp('prime');
primeTheEngine.cdi();

const requestListener = function (req, res) {
  res.writeHead(200);
  test();
  res.end("Hello, World!");
};

const server = http.createServer(requestListener);
server.listen(8080);

function test() {
  const name = "Dax";

  readFile("./sample.txt", "utf8", (err, data) => {
    if (err) {
      console.err(err);
      return;
    }
    text = data;
    const doc = nlp(text);
    //console.log("Initial Doc:")
    //doc.debug();
    doc.cdi();
    console.log("After CDI:");
    doc.debug();

  });

}
