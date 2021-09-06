const cdi = require ('./index');
cdi('Howard the Duck', 'Howard the Duck is a debonair fowl who parties hard.')
   .then(doc => {
       console.log(JSON.stringify(doc, null, 4));
   });
