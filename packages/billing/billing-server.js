var stripe;

// var METHODS = ['charges'];

Billing.setStripeSecret = function(secret) {
  stripe = Npm.require('stripe')(secret);

  // _.each(METHODS, function(name) {
  //   stripe[name] = Meteor._wrapAsync(stripe[name]);
  // });

  stripe.customers.create = Meteor.wrapAsync(stripe.customers.create, stripe.customers);
  stripe.charges.create = Meteor.wrapAsync(stripe.charges.create, stripe.charges);
}

Meteor.methods({
  'billing/attachCard': function(token) {
    check(token, String);
    check(this.userId, String);

    var customer = stripe.customers.create({
      card: token,
      description: Meteor.userId()
    });

    Meteor.users.update(this.userId, {$push: {'billing.customer': customer}});
  },

  'billing/purchaseProductAtLevel': function(productKey, level, code) {
    console.log(arguments);
    check(productKey, String);
    check(level, String);
    check(code, Match.Optional(String));

    var user = Meteor.user();
    var customer = user.billing.customer[0];
    if (! customer) {
      throw new Meteor.Error('no-customer', "You need to attach your card before you make that purchase");
    }

    var product = Products.findOne({key: productKey});
    if (! product || ! _.find(product.levels, function(l) { return l.key === level; })) {
      throw new Meteor.Error('no-product', "That product was not found");
    }

    var options = {
      fromLevel: user.productLevel(product),
      toLevel: level
    };
    if (! options.fromLevel) {
      delete options.fromLevel;
    }

    if (code) {
      options.code = Codes.findOne({key: code});
      if (! options.code) {
        throw new Meteor.Error('no-code', "That product code was not found");
      }
    }

    var purchase = Billing.createPurchase(user, product, options);

    console.log(purchase);

    // FIXME: AUD / description
    // actually make the payment
    purchase.stripeCharge = stripe.charges.create({
      amount: purchase.price * 100,
      currency: "aud",
      customer: customer.id,
      description: "payinguser@example.com"
    });

    // TODO: we need to test this, move to a billing function
    Purchases.insert(purchase);

    var updated = Meteor.users.update({
      _id: user._id,
      'productLevels.productKey': purchase.productKey
    }, {$set: {'productLevels.$.level': purchase.toLevel}});

    if (updated === 0) {
      Meteor.users.update(user._id, {$push: {productLevels: {
        productKey: purchase.productKey,
        level: purchase.toLevel
      }}});
    }


    return purchase;
  }
});