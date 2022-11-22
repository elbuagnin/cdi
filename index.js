import './local-config.js';
import { setCDIOptions } from "./startup/CDIConfig.js";
import initialize from "./startup/initialize.js";
import prepDoc from './prepDoc.js';

function cdiInit () {
  console.log("index cdiInit");
  initialize();
}

const cdiDoc = {
    api: (View) => {
      View.prototype.cdiDoc = function () {
        if (arguments.length > 0) {
          setCDIOptions(arguments);
        }
        console.log("index cdi")
        
        prepDoc(this); 
      };
    },
  };
  
  export {cdiDoc, cdiInit};