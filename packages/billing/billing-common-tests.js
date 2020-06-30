var BASIC_USER = {
  _id: 'user-id'
};

var BASIC_PRODUCT = {
  _id: 'product-id',
  key: 'product-key',
  levels: [
    {key: 'first', price: 10},
    {key: 'second', price: 20},
  ]
};

var USER_WITH_FIRST = {
  _id: 'user-with-first',
  productLevels: [
    { productKey: BASIC_PRODUCT.key, levelKey: 'first' }
  ]
};

var BASIC_CODE = {
  _id: 'code-id',
  discount: 0.1
};

Tinytest.add('Billing - Purchases - createPurchase - basic', function(test) {
  var purchase = Billing.createPurchase(BASIC_USER, BASIC_PRODUCT, 'second', BASIC_CODE);

  test.isUndefined(purchase.fromLevelKey);
  test.equal(purchase.toLevelKey, 'second');
  test.equal(purchase.price, 18);
  test.equal(purchase.userId, BASIC_USER._id);
});


Tinytest.add('Billing - Purchases - createPurchase - user has product', function(test) {
  var purchase = Billing.createPurchase(USER_WITH_FIRST, BASIC_PRODUCT, 'second', BASIC_CODE);

  test.equal(purchase.fromLevelKey, 'first');
  test.equal(purchase.toLevelKey, 'second');
  test.equal(purchase.price, 9);
  test.equal(purchase.userId, USER_WITH_FIRST._id);
});

Tinytest.add('Billing - Purchases - createPurchase - no user', function(test) {
  var purchase = Billing.createPurchase(null, BASIC_PRODUCT, 'second', BASIC_CODE);

  test.isUndefined(purchase.fromLevelKey);
  test.equal(purchase.toLevelKey, 'second');
  test.equal(purchase.price, 18);
  test.isUndefined(purchase.userId);
});

Tinytest.add('Billing - Purchases - pricePurchase basic', function(test) {
  var purchase = {
    toLevelKey: 'first'
  };

  Billing.pricePurchase(purchase, BASIC_PRODUCT);
  test.equal(purchase.price, 10);
});

Tinytest.add('Billing - Purchases - pricePurchase upgrade', function(test) {
  var purchase = {
    toLevelKey: 'second',
    fromLevelKey: 'first'
  };

  Billing.pricePurchase(purchase, BASIC_PRODUCT);
  test.equal(purchase.price, 10);
});


Tinytest.add('Billing - Codes - basic discount', function(test) {
  var purchase = {
    price: 100
  };

  Billing.discountWithCode(purchase, BASIC_CODE);

  test.equal(purchase.price, 90);
  test.equal(purchase.undiscountedPrice, 100);
  test.equal(purchase.codeId, BASIC_CODE._id);
});

Tinytest.add('Billing - Users - attachUserToPurchase upgrade', function(test) {
  var purchase = {
    productKey: BASIC_PRODUCT.key,
    toLevelKey: 'second',
    fromLevelKey: 'first'
  };

  Billing.attachUserToPurchase(USER_WITH_FIRST, purchase);

  test.equal(purchase.userId, USER_WITH_FIRST._id);
});

Tinytest.add('Billing - Users - attachUserToPurchase upgrade not allowed', function(test) {
  var purchase = {
    productKey: BASIC_PRODUCT.key,
    toLevelKey: 'second',
    fromLevelKey: 'first'
  };

  test.throws(function() {
    Billing.attachUserToPurchase(BASIC_USER, purchase);
  });
});


Tinytest.add('Billing - Users - userHasProductAtLevel basic', function(test) {
  var user = {
    productLevels: [
      { productKey: BASIC_PRODUCT.key, levelKey: 'second' }
    ]
  };

  test.isTrue(Billing.userHasProductAtLevel(user, BASIC_PRODUCT, 'first'));
  test.isTrue(Billing.userHasProductAtLevel(user, BASIC_PRODUCT, 'second'));
});

Tinytest.add('Billing - Users - userHasProductAtLevel not there yet', function(test) {
  var user = {
    productLevels: [
      { productKey: BASIC_PRODUCT.key, levelKey: 'first' }
    ]
  };

  test.isTrue(Billing.userHasProductAtLevel(user, BASIC_PRODUCT, 'first'));
  test.isFalse(Billing.userHasProductAtLevel(user, BASIC_PRODUCT, 'second'));
});

Tinytest.add('Billing - Users - userHasProductAtLevel no purchase', function(test) {
  var user = {
    productLevels: []
  };

  test.isFalse(Billing.userHasProductAtLevel(user, BASIC_PRODUCT, 'first'));
  test.isFalse(Billing.userHasProductAtLevel(user, BASIC_PRODUCT, 'second'));
});