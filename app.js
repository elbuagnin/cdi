import http from "http";
import { readFile } from "fs";
import nlp from "compromise";
import {cdiDoc, cdiInit} from "./index.js";
var text = "";

cdiInit();
nlp.plugin(cdiDoc);

const requestListener = function (req, res) {
  res.writeHead(200);
  test();
  res.end("Hello, World!");
};

const server = http.createServer(requestListener);
server.listen(8080);

function test() {
  const name = "name=Dax";

  readFile("./sample.txt", "utf8", (err, data) => {
    if (err) {
      console.err(err);
      return;
    }
    console.log("App");
    text = data;
    const doc = nlp(text);
    doc.cdiDoc(name);
    
    doc.debug();

    console.log(JSON.stringify(doc.getArchetypes()));
    console.log(JSON.stringify(doc.getAppearance()));
  });

}
