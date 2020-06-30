Codes = new Mongo.Collection('codes');

Codes.Schema = new SimpleSchema({
  siteKey: { type: String },
  key: { type: String },
  discount: { type: Number, decimal: true }
});
