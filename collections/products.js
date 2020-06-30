Products = new Mongo.Collection('products');

Products.Schema = new SimpleSchema({
  siteKey: { type: String },
  key: { type: String },
  name: { type: String },
  
  levels: { type: [Object] },
  'levels.$.key': { type: String },
  'levels.$.name': { type: String },
  'levels.$.description': { type: String },
  'levels.$.price': { type: Number },
  'levels.$.disabled': { type: Boolean, optional: true }
});

Products.helpers({
  purchases: Utils.cursor(function(query, where) {
    where.productKey = this.key;
    return Purchases.find(query, where);
  }),
  
  highestLevel: function () {
    return this.levels[this.levels.length - 1];
  },
  
  // TODO: Should this code be moved to billings and tested?
  levelIndex: function (levelKey) {
    // basically _.findIndex (which doesn't seem to exist in this version)
    var i = 0, result = -1;
    _.find(this.levels, function(l) {
      var match = (l.key === levelKey);
      if (! match) {
        i += 1;
      } else {
        result = i;
      }
      return match;
    });
    return result;
  },
  
  // empty if levelKey doesn't exist
  levelsUpTo: function(levelKey) {
    var index = this.levelIndex(levelKey);
    return this.levels.slice(0, index+1);
  },
  
  gumroadPurchaseUrl: function(level, user, code) {

    var product = this;
    var userLevel = !!user ? user.productLevel(product).key : "free";
    var gumroadCode = getGumroadCode(userLevel, level.key);
    var url = "https://gumroad.com/a/460731507/" + gumroadCode;
    
    if (user) {
      url += '?email=' + user.getEmail();
    }
  
    return url;
  }
});

Products.mutate = {
  insert: function(doc) {
    check(doc, Products.Schema);
    return Products.insert(doc);
  },
  
  remove: function(id) {
    var product = Products.findOne(id);
    
    // Don't remove purchases, we want to keep a record
    
    return Products.remove(id);
  }
}