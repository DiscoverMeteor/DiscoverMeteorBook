var onePerRecord = function(cursor, name, fn) {
  if (! _.isFunction(fn))
    throw "Must pass function into `onePerRecord`";

  var count = cursor.count();
  Log('Updating ' + count + ' ' + name + 's');

  var i = 0;
  cursor.forEach(function(record) {
    i += 1;
    if (i % 100 === 0)
      Log('Up to the ' + i + 'th ' + name);

    return fn(record);
  });

  Log('Completed updating ' + count + ' ' + name + 's');
}

var Future = Npm.require('fibers/future');
var onePerRecordParallel = function(cursor, name, fn) {
  if (! _.isFunction(fn))
    throw "Must pass function into `onePerRecordParallel`";

  var count = cursor.count();
  Log('Updating ' + count + ' ' + name + 's');

  if (! count)
    return 0;

  var future = new Future;

  var i = 0;
  cursor.forEach(function(record) {
    Meteor.defer(function() {
      fn(record);

      i += 1;
      if (i % 100 === 0)
        Log('Completed the ' + i + 'th ' + name);

      if (i === count) {
        Log('Completed updating ' + count + ' ' + name + 's');
        future.return(count);
      }
    });
  });

  return future.wait();
}


Migrations.add({
  name: 'Fix users with duplicate purchases',
  version: 1,
  up: function() {
    onePerRecord(Meteor.users.find(), 'user', function(user) {
      _.each(user.purchases, function (purchase) {
        var existing = _.filter(user.purchases, function(p) {
          return p.code === purchase.code;
        });
        var nTooMany = existing.length - 1;
        if (nTooMany > 0) {
          Log('Found ' + nTooMany + ' too many ' + purchase.code + ' purchases for ' + user.getEmail());
          // pull *all* purchases
          Meteor.users.update(user._id, {
            $pull: {purchases: {code: purchase.code}},
            $inc: {points: -1 * nTooMany * purchase.points}
          });
          // push one back
          Meteor.users.update(user._id, {
            $push: {purchases: purchase},
          });

          // reset the user
          user = Meteor.users.findOne(user._id);
        }
      });
    })
  }
});

Migrations.add({
  name: 'Fix users with redundant MD accounts',
  version: 2,
  up: function() {
    // we are interested in users who have *only* purchased the starter edition
    var mdUsers = Meteor.users.find({
      'services.meteor-developer': {$exists: true},
      'services.password': {$exists: false},
      'purchases': {$size: 1},
      'purchases.0.code': 'starter'
    }, {fields: {'services.meteor-developer.emails': 1}});

    onePerRecord(mdUsers, 'user', function(mdUser) {
      var email = mduser.getEmail();
      var passwordsUser = Meteor.users.findOne({
        'emails.address': email,
        'services.meteor-developer': {$exists: false},
      });
      if (! passwordsUser)
        return;

      console.log("Found duplicate user", email, "removing MD account");

      Meteor.users.remove(mdUser._id); // remove first so we don't get a dupe id
      Meteor.users.update(passwordsUser._id, {$set: {
        'services.meteor-developer': mdUser.services['meteor-developer']
      }});
    })
  }
});

Migrations.add({
  name: 'Ensure all users have emails',
  version: 3,
  up: function() {
    // we are interested in users who have *only* an MD account
    var mdUsers = Meteor.users.find({
      'services.meteor-developer': {$exists: true},
      'services.password': {$exists: false},
    }, {fields: {'services.meteor-developer.emails': 1}});

    onePerRecord(mdUsers, 'user', function(mdUser) {
      var email = mduser.getEmail();
      var passwordsUser = Meteor.users.findOne({
        'emails.address': email
      });
      if (passwordsUser) {
        console.error("Can't add password to user with MD email: " + email + " as a passwords user with that email exists.");
        console.error("Please re-run migration 2 to aggregate their accounts.");
        return;
      }

      Meteor.users.update(mdUser._id, {
        $push: {emails: {address: email, verified: false}},
        $set: {'services.password': {}}
      });
    })
  }
});

Migrations.add({
  name: 'Seed DM product information',
  version: 4,
  up: function() {
    var dmId = Sites.mutate.insert({
      hostname: 'book.discovermeteor.com',
      key: 'dm'
    });

    var dmBookId = Products.mutate.insert({
      siteKey: 'dm',
      key: 'dmBook',
      name: 'Discover Meteor',
      levels: [
        { key: 'free', name: 'Free Edition', price: 0, description: "The first four chapters of the book." },
        { key: 'starter', name: 'Starter Edition', price: 0, description: "The first eight chapters of the book." },
        { key: 'book', name: 'Standard Edition', price: 29, description: "The whole book, including 14 chapters and 11 sidebars."},
        { key: 'full', name: 'Full Edition', price: 89, description: "The whole book plus <strong>four extra chapters</strong>." },
        { key: 'premium', name: 'Premium Edition', price: 179, description: "The Full Edition, plus <strong>a Discover Meteor t-shirt</strong> and extra content.", disabled: true }
      ]
    });

    // insert some (which? all?) codes.
  },
  down: function() {
    Sites.mutate.remove(Sites.findOne());
  }
});

Migrations.add({
  name: 'Transition old Gumroad DM users',
  version: 5,
  up: function() {
    var dmSite = Sites.findOne({ hostname: 'book.discovermeteor.com' });
    var dmBook = Products.findOne({ siteKey: dmSite.key, key: 'dmBook' });

    // a map from keys -> index of that key in dmBook.levels
    var levelIndices = _.object(_.pluck(dmBook.levels, 'key'), 
      _.range(0, dmBook.levels.length));

    onePerRecord(Meteor.users.find({purchases: {$exists: true}}), 'user', function(user) {
      var exceptions = [];
    
      var userFailed = false;
      var sortedPurchases = _.sortBy(user.purchases, function(purchase) {
        var match = purchase.code.match(/(.*)_to_(.*)/);
        var key = (match ? match[2] : purchase.code);
        return levelIndices[key];
      });
        
      _.each(sortedPurchases, function(purchase) {
        // reset the user
        user = Meteor.users.findOne(user._id);

        if (_.include(['team', 'team-member'], purchase.code)) {
          userFailed = true;
          return exceptions.push(purchase);
        }

        try {
          if (purchase.fullRequest && purchase.code !== 'limited') {
            // uses the old GR info to create a purchase in the new format
            Gumroad.createPurchaseFromParams(user, purchase.fullRequest)
          } else {
            var toLevelKey = purchase.code;
            var match = purchase.code.match(/_to_(.*)/);
            if (match) {
              toLevelKey = match[1];
            }
            // special case, treat limited as starter
            if (toLevelKey === 'limited') {
              toLevelKey = 'starter';
            }

            var newPurchase = Billing.createPurchase(user, dmBook, toLevelKey);
            Purchases.mutate.insert(newPurchase);
          }
        } catch (e) {
          if (e.error === 'wrong-upgrade') {
            userFailed = true;
            return exceptions.push(purchase);
          } else {
            console.log("Bailing, due to error on:", purchase);
            throw e;
          }
        }
      });

      if (!userFailed) {
        Meteor.users.update(user._id, { $unset: {purchases: true, points: true} });
      } else {
        // figure out the highest level the user had
        var toLevelKey = 'starter';
        if (user.points >= 1000) {
          toLevelKey = 'premium';
        } else if (user.points >= 100) {
          toLevelKey = 'full';
        } else if (user.points >= 10) {
          toLevelKey = 'book';
        }

        var newPurchase = Billing.createPurchase(user, dmBook, toLevelKey);
        // Store the old charges here for posterity
        newPurchase.gumroadCharge = {
          originalPurchases: exceptions
        };
        Purchases.mutate.insert(newPurchase);
        Meteor.users.update(user._id, { $unset: {purchases: true, points: true} });
      }
    });
  }
});

Migrations.add({
  name: 'Denormalize emails',
  version: 6,
  up: function() {
    var usersWithNoEmail = Meteor.users.find({email: {$exists: false}});
    console.log("// Found " + usersWithNoEmail.count() + " users with no user.email property");
    usersWithNoEmail.forEach(function (user) {
      var email = Users.getEmail(user);
      // console.log(email)
      Meteor.users.update(user._id, {$set: {email: email}});
    });
  }
});

Migrations.add({
  name: 'Denormalize emails on purchases',
  version: 7,
  up: function() {
    var purchasesWithNoEmail = Purchases.find({email: {$exists: false}});
    console.log("// Found " + purchasesWithNoEmail.count() + " purchases with no purchase.email property");
    purchasesWithNoEmail.forEach(function (purchase) {
      var user = Meteor.users.findOne(purchase.userId);
      var email = Users.getEmail(user);
      // console.log(email)
      Purchases.update(purchase._id, {$set: {email: email}});
    });
  }
});

// not sure if needed on production data?
// Migrations.add({
//   // user.productLevels.level -> user.productLevels.levelKey
//   name: 'Update user.productLevels',
//   version: 8,
//   up: function() {
//     Meteor.users.find().forEach((user) => {
//       if (user.productLevels) {
//         user.productLevels.forEach((level, index) => {
//           var update = {$set: {}, $unset: {}};
//           update.$unset['productLevels.' + index + '.level'] = "";
//           update.$set['productLevels.' + index + '.levelKey'] = level.level;
//           Meteor.users.update({_id: user._id}, update);
//         });
//       } else {
//         console.log(user)
//       }
//     });
//   }
// });

Meteor.methods({
  migrateToLatest: function() {
    if (Meteor.user().isAdmin()) {
      console.log("// migrateToLatest")
      Migrations.migrateTo('latest');
    }
  }
});