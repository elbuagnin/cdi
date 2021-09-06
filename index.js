"use strict";
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
require('./names/tag-name');

module.exports = async function cdi(name, description) {
   var doc = nlp(description).debug();
   const nameTags = await tagName(name);
   console.log(nameTags);

   for (let tag in nameTags) {
      let word = doc.match(nameTags[tag]).debug();
      word.tag(tag).debug();

      // Add 'principal' tag to names.
      switch (tag) {
          case 'fullName':
              word.tag('Principal').debug();
              break;
          case 'firstName':
              word.tag('Principal');
              break;
          case 'lastName':
              word.tag('Principal');
              break;
      }
   }

   // Start breaking down doc to sentences, clauses, and phrases.
     var sentences = doc.sentences().debug();
     for (let i = 0; i < sentences.length; i++) {
         var subjects = sentences.subjects().debug();
         var clauses = sentences.clauses().debug();

         for (let j=0; j < clauses.length; j++) {
             let clause = nlp(clauses[j]).debug();
             if (clause.has('#ProperNoun')) {console.log('Yes');}
         }

     }

     console.log(subjects);
     console.log(clauses);
}
