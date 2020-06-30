// TODO: I'm not sure how to avoid hardcoding this stuff here -- how to
//   properly annotate all *combinations* of levels with GR codes?
var PRODUCT_CODE = 'dmBook';
var CODES_TO_LEVEL_KEYS = {
  'eDzA': { to: 'book' },
  'ZjlD': { to: 'full' },
  'OwKC': { to: 'premium' },
  'Bqld': { from: 'book', to: 'full' },
  'zIux': { from: 'book', to: 'premium' },
  'GPah': { from: 'full', to: 'premium' },
  'vOhG': { from: 'starter', to: 'book' },
  'XiZOm': { from: 'starter', to: 'full' },
  'aWgr': { from: 'starter', to: 'premium' }
};

Gumroad = {
  // Create a purchase from the set of data posted to us from gumroad
  createPurchaseFromParams: function(user, params) {
    // params is the set of data posted to us by GR
    //   all we need is the permalink
    check(params, Match.ObjectIncluding({
      permalink: String,
      offer_code: Match.Optional(String)
    }));

    var book = Products.findOne({key: PRODUCT_CODE});

    var levelKeys = CODES_TO_LEVEL_KEYS[params.permalink];
    if (! levelKeys) {
      throw new Meteor.Error('unknown-code', "Unknown code " + params.permalink);
    }

    // TODO -- find the offer
    var purchase = Billing.createPurchase(user, book, levelKeys.to);

    if (purchase.fromLevelKey !== levelKeys.from) {
      // Special case -- we treat free + starter as interchangeable in terms of upgrades,
      //   because it's just so common that people get it the wrong way around.
      if ((!purchase.fromLevelKey && levelKeys.from === 'starter') ||
        (purchase.fromLevelKey === 'starter' && !levelKeys.from)) {
        console.log('Treating purchase from ' + levelKeys.from + ' as ' + purchase.fromLevelKey);
      } else {
        throw new Meteor.Error('wrong-upgrade', "You can't upgrade from that level");
      }
    }

    // store for posterity
    purchase.gumroadCharge = params;

    return Purchases.mutate.insert(purchase);
  },

  handleWebhook: function(params) {
    
    console.log('=========================== Receiving Webhook ===========================')
    console.log('--------- params: ---------')
    console.log(params)
    console.log('---------------------------')

    check(params, Match.ObjectIncluding({
      email: String
    }));

    if (! params.email) {
      throw new Meteor.Error('no-email', "Can't make a gumroad purchase without an email");
    }

    if (params.email == 'hello@discovermeteor.com' || params.email == 'hello%40discovermeteor.com'){
      console.log('-> Detected Gumroad test');
      return 'http://book.discovermeteor.com/test';
    }

    var user = Meteor.users.findOneByEmail(params.email), url;

    if (user) {
      console.log('-> Upgrading user (' + params.email + ')');

      // We just send the user back to the site, assuming they can login
      url = Meteor.absoluteUrl();
    } else {
      console.log('-> Creating new user (' + params.email + ')');

      var userId = Meteor.users.mutate.insert({email: params.email});
      user = Meteor.users.findOne(userId);

      url = user.finishSignupUrl();
    }

    Gumroad.createPurchaseFromParams(user, params);

    return url;
  }
};
