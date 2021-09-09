module.exports = class SentenceStructure {
   constructor(doc) {
      this.doc = doc;
      this.sentences = [];
      this.clauses = [];

      this.breakdown();
   }

   get structure() {
      return {sentences: this.sentences, clauses: this.clauses};
   }

   breakdown() {
      this.sentences = this.doc.sentences();
      this.clauses = this.doc.clauses();

      // for (let i = 0; i < this.structure.sentences.length; i++) {
      //     this.structure.sentences.subject = this.structure.sentences.subjects();
      //     this.structure.sentences.clauses = this.structure.sentences.clauses();
      // }
   }
}
