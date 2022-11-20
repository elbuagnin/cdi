import './local-config.js';
import startPlayerPiano from "./startup/startPlayerPiano.js";
import { setPlayerPianoOptions } from "./startup/playerPianoConfig.js";
import { setCDIOptions } from "./startup/CDIConfig.js";
import initialize from "./startup/initialize.js";

function cdiInit () {
  initialize();
}

const cdi = {
    api: (View) => {
      View.prototype.cdi = function () {
        if (arguments.length > 0) {
          setCDIOptions(arguments);
        }
  
        const playerPianoOptions = "verbose=none";
        setPlayerPianoOptions(playerPianoOptions);
  
        startPlayerPiano(this); 
        this.debug();
      };
    },
  };
  
  export {cdi, cdiInit};