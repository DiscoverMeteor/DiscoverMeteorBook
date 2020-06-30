Billing = Billing || {};

Billing.createPurchase = function(user, product, levelKey, code) {
  // user && check(user, Match.Optional(Object));
  // check(product, Object);
  check(levelKey, String);
  check(code, Match.Optional(Object));

  var purchase = {
    productKey: product.key,
    toLevelKey: levelKey
  };

  var fromLevelKey = user && Billing.userProductLevelKey(user, product.key);
  if (fromLevelKey) {
    purchase.fromLevelKey = fromLevelKey;
  }

  Billing.pricePurchase(purchase, product);

  if (code) {
    Billing.discountWithCode(purchase, code);
  }

  if (user) {
    Billing.attachUserToPurchase(user, purchase);
  }
  return purchase;
};

Billing.pricePurchase = function(purchase, product) {
  // work out price from the product
  purchase.price = _.find(product.levels, function(l) {
    return l.key === purchase.toLevelKey;
  }).price;

  if (purchase.fromLevelKey) {
    purchase.price -= _.find(product.levels, function(l) {
      return l.key === purchase.fromLevelKey;
    }).price;
  }
};

// Attach the user to a purchase, first ensuring they are allowed to make it
Billing.attachUserToPurchase = function(user, purchase) {
  if (purchase.fromLevelKey) {
    if (Billing.userProductLevelKey(user, purchase.productKey) !== purchase.fromLevelKey) {
      throw new Meteor.Error('forbidden', "You can't upgrade from that level");
    }
  }
  
  // also denormalize user email on purchase object just in case
  if (user.getEmail()) {
    purchase.email = user.getEmail();
  }

  purchase.userId = user._id;
};

// update the purchase with:
//   - a reference to the offer
//   - a new price that reflects the offer
Billing.discountWithCode = function(purchase, code) {
  purchase.codeId = code._id;
  purchase.undiscountedPrice = purchase.price;
  purchase.price = (1 - code.discount) * purchase.price;
};

// returns the key of the product level the user is up to
Billing.userProductLevelKey = function(user, productKey) {
  
  if (user.isAdmin()) {
    return "admin";
  }
  var productLevel = _.find(user.productLevels, function(pl) {
    return pl.productKey === productKey;
  });
  return productLevel && productLevel.levelKey;
};

// is lessLevel < greaterLevel for product?
Billing.isLowerProductLevelKey = function(product, lessLevelKey, greaterLevelKey) {
  var keys = _.pluck(product.levels, 'key');
  return _.indexOf(keys, lessLevelKey) < _.indexOf(keys, greaterLevelKey);
};

Billing.userHasProductAtLevel = function(user, product, levelKey) {
  var userLevelKey = Billing.userProductLevelKey(user, product.key);

  if (! userLevelKey) {
    return false;
  }

  return ! Billing.isLowerProductLevelKey(product, userLevelKey, levelKey);
};