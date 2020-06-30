Users = Meteor.users;

Meteor.users.Schema = new SimpleSchema({
  email: { type: String, optional: true},
  productLevels: { type: [Object], optional: true },
  'productLevels.$.productKey': { type: String },
  'productLevels.$.levelKey': { type: String },

  billing: { type: Object, blackbox: true, optional: true }
});

Meteor.users.findOneByEmail = function(email) {
  return Meteor.users.findOne({$or: [
      {email: email},
      {'emails.address': email},
      {'services.meteor-developer.emails.address': email}
    ]
  });
};

Users.isAdminById = function (userId) {
  var user = Meteor.users.findOne(userId);
  return user && user.isAdmin();
};

Users.getEmail = function (user) {
  if (user.email) {
    return user.email;
  } else if (user.emails) {
    return user.emails[0].address;
  } else if (user.services) {
    return user.services['meteor-developer'].emails[0].address;
  }
};

Users.getEnrollMethod = function (user) {
  if (!user.services) {
    return null;
  } else if (user.services['meteor-developer']) {
    return 'meteor-developer';
  } else if (user.services.password && (!!user.services.password.srp || !!user.services.password.bcrypt)) {
    return 'password';
  } else {
    return 'pending';
  }
};

Meteor.users.helpers({
  getEmail() {
    return Users.getEmail(this);
  },

  hasEmail() {
    return this.emails && this.emails[0].address;
  },

  hasMeteorAccount() {
    return this.services && this.services['meteor-developer'];
  },

  isAdmin() {
    return !!this.admin;
  },

  purchases: Utils.cursor(function(query, where) {
    where.userId = this._id;
    return Purchases.find(query, where);
  }),

  // FIXME: this is a bit obtuse
  productLevel(product) {
    var levelKey = Billing.userProductLevelKey(this, product.key);

    if (levelKey === 'admin') {
      return {name: 'admin'};
    }

    if (levelKey === null) {
      return {name: 'none'};
    }
    
    return _.find(product.levels, function(l) { return l.key === levelKey });
  },

  accessibleProductLevels(product) {
    if (this.isAdmin()) {
      return product.levels;
    } else {
      return product.levelsUpTo(Billing.userProductLevelKey(this, product.key));
    }
  },

  hasPurchased(product) {
    return !! this.productLevel(product);
  },

  hasProductAtLevel(product, level) {
    return Billing.userHasProductAtLevel(this, product, level);
  },

  availableUpgradeLevels(product) {
    var self = this;
    if (self.isAdmin()) {
      return [];
    }
    return _.filter(product.levels, function(level) {
      return ! self.hasProductAtLevel(product, level.key) && !level.disabled;
    });
  },

  finishSignupUrl(token) {
    token = typeof token === "undefined" ? this.originalToken : token;
    var url = Meteor.absoluteUrl() + "finish-signup/" + token + "/";
    return url;
  },

  resetPasswordUrl(token) {
    token = typeof token === "undefined" ? this.originalToken : token;
    var url = Meteor.absoluteUrl() + "reset-password/" + token + "/";
    return url;
  },

  enrollMethod() {
    return Users.getEnrollMethod(this);
  },

  hasPermission(product, level) {
    var user = this;
    return user && (user.isAdmin() || user.hasProductAtLevel(product, level));
  },

  getUsername() {
    var user = this;
    if (user.username) {
      return user.username;
    } else if (user.services && user.services['meteor-developer']) {
      return user.services['meteor-developer'].username;
    }
  }

});

// after a user is created, add their email at user.email
Users.after.insert(function (userId, user) {
  var email = Users.getEmail(user);
  Users.update(user._id, {$set: {email: email}}); 
});

Meteor.methods({
  'users/changeEmail': function (userId, email) {
    if (userId === this.userId || Users.isAdminById(this.userId)) {
      var emailUser = Meteor.users.findOneByEmail(email);
      if (emailUser) {
        throw new Meteor.Error("email_used", "Sorry, this email is already in use.");
      } else {
        Meteor.users.update({_id: userId}, {$set: {email: email, 'emails.0.address': email}});
      }
    }
  }
});