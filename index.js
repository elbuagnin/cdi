import './local-config.js';
import startPlayerPiano from "./parser.js";
import { setPlayerPianoOptions } from "./startup/playerPianoConfig.js";
import { setCDIOptions } from "./startup/CDIConfig.js";
import initialize from "./startup/initialize.js";

function cdiInit () {
  console.log("index cdiInit");
  initialize();
}

const cdi = {
    api: (View) => {
      View.prototype.cdi = function () {
        if (arguments.length > 0) {
          setCDIOptions(arguments);
        }
        console.log("index cdi")
        const playerPianoOptions = "verbose=none";
        setPlayerPianoOptions(playerPianoOptions);
  
        startPlayerPiano(this); 
      };
    },
  };
  
  export {cdi, cdiInit};