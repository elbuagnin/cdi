import nlp from "compromise";

const addGetArchetypes = nlp.extend({
  api: (View) => {
    View.prototype.getArchetypes = function () {
      return this.match("#Archetype");
    };
  },
});

export default addGetArchetypes;
