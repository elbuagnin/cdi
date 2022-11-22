import nlp from "compromise";

const addGetArchetypes = nlp.extend({
  api: (View) => {
    View.prototype.getArchetypes = function () {
        const archetypeList = nlp.world().canBe("#Archetype");
        console.log(JSON.stringify(archetypeList));
    
      return this.match("#Archetype");
    };
  },
});

export default addGetArchetypes;
