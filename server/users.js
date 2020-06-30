// The only time you are allow to create a new user
// that has a MD account is when they are buying the
// starter edition. We want to double check that they
// don't already have a passwords account
Accounts.validateNewUser(function(user) {
  if (user.services && user.services['meteor-developer']) {
    var email = user.services['meteor-developer'].emails[0].address;

    if (!! Meteor.users.findOne({'emails.address': email})) {
      throw new Meteor.Error('existing-user', "It looks like you already have an account using the email “"+email+"”. Please <a href=\"/email-login\">log in</a> to access it.");
    }
  }

  return true;
});


Accounts.onCreateUser(function(options, user) {

  trackEvent('User Created', 'User Created', null, null, {
    distinct_id: user._id
  });

  mixpanel.people.set(user._id, {
    $email: Meteor.users._transform(user).getEmail()
  });

  return user;
});


// NOTE: copied from oauth/pending_credentials -- to get it without removing
var _retrievePendingCredential = function(key, credentialSecret) {
  check(key, String);

  var pendingCredential = OAuth._pendingCredentials.findOne({
    key: key,
    credentialSecret: credentialSecret || null
  });
  if (pendingCredential) {
    // OAuth._pendingCredentials.remove({ _id: pendingCredential._id });
    if (pendingCredential.credential.error)
      return recreateError(pendingCredential.credential.error);
    else
      return OAuth.openSecret(pendingCredential.credential);
  } else {
    return undefined;
  }
};

var resetTokenAttributes = function(email) {
  var token = Random.id();
  var when = new Date();
  return {
    "services.password.reset": {
      token: token,
      email: email,
      when: when
    }
  };
};

Meteor.users.mutate = {
  insert: function(doc) {
    check(doc, {
      email: String
    });

    // check for existing Meteor Accounts user with same email
    var user = Meteor.users.findOne({'services.meteor-developer.emails.address': doc.email});

    if (! user) {
      var userId = Accounts.createUser({email: doc.email});
      user = Meteor.users.findOne(userId);
    }

    var attrs = resetTokenAttributes(doc.email);
    user.originalToken = attrs['services.password.reset'].token;
    // set a reset token on the user, and also track it for posterity
    Meteor.users.update(userId, {$set: _.extend(attrs, {
      originalToken: user.originalToken
    })});

    // var url = user.finishSignupUrl();
    // var emailOptions = {
    //   from: 'Discover Meteor <hello@discovermeteor.com>',
    //   to: email,
    //   subject: 'Create your Discover Meteor account',
    //   text: 'Thanks for buying Discover Meteor! Please use this link to finish signing up and access your book: '+url,
    //   html: 'Thanks for buying Discover Meteor! <br/><br/><a href="'+url+'">Finish signing up to access your book.</a>'
    // };
    //
    // console.log('// sending email');
    // console.log(emailOptions);
    //
    // Email.send(emailOptions);

    return user._id;
  },

  resetPassword: function(email) {
    var user = Meteor.users.findOne({'emails.address':email});
    if (user) {
      var attrs = resetTokenAttributes(email);
      Meteor.users.update(user._id, {$set: attrs});
      var url = user.resetPasswordUrl(attrs['services.password.reset'].token);
      Email.send({
        from: 'hello@discovermeteor.com',
        to: email,
        subject: 'Reset your password for Discover Meteor',
        text: "To reset your password, simply click the link below.\n\n"+url+"\n\nThanks!"
      });

    } else {
      throw new Meteor.Error('not-found', 'User not found');
    }
  },

  remove: function(userId) {
    // FIXME: Should we do more than this? Remove purchases?
    Meteor.users.remove(userId);
  }
};

Meteor.methods({
  'Meteor.users.mutate.resetPassword': function(email) {
    check(email, String);
    return Meteor.users.mutate.resetPassword(email);
  },

  'Meteor.users.mutate.insertAndPurchase': function(email, productKey, levelKey) {
    var user = Meteor.user();
    if (! user || ! user.isAdmin()) {
      throw new Meteor.Error('forbidden', "You can't do that!");
    }

    var userId = Meteor.users.mutate.insert({email: email});
    user = Meteor.users.findOne(userId);

    return Purchases.mutate.insertFromKeys(email, productKey, levelKey);
  },

  'Meteor.users.mutate.remove': function(userId) {
    check(userId, String);
    var user = Meteor.user();
    if (user._id !== userId && ! user.isAdmin()) {
      throw new Meteor.Error('forbidden', "You can't do that!");
    }

    return Meteor.users.mutate.remove(userId);
  },

  // has this token been used yet (i.e. do we have a password or MD account?)
  tokenUsed: function(token) {
    var user = Meteor.users.findOne({originalToken: token});

    if (! user) {
      throw new Meteor.Error("tokenUsed: No user with that token!");
    } else {
      if (user.services['meteor-developer'])
        return 'meteor-developer';

      if (user.services.password.bcrypt || user.services.password.srp)
        return 'password';
    }
  },

  oauthUserExists: function(credentialToken, credentialSecret) {
    check(credentialToken, String);
    check(credentialSecret, String);

    var result = _retrievePendingCredential(credentialToken, credentialSecret);
    return result && !! Meteor.users.findOne({'services.meteor-developer.id': result.serviceData.id});
  },

  attachMDAccountToUserByCredential: function(token, credentialToken, credentialSecret) {
    check(token, String);
    check(credentialToken, String);
    check(credentialSecret, String);

    var result = _retrievePendingCredential(credentialToken, credentialSecret);

    if (! result)
      throw new Meteor.Error('Oauth failure');

    console.log(result, token, Meteor.users.findOne({'services.password.reset.token': token}))
    var updated = Meteor.users.update({'services.password.reset.token': token},
      { '$set': { 'services.meteor-developer': result.serviceData } });

    if (! updated)
      throw new Meteor.Error('attachAccount: No user with that token');
  },

  attachMDAccountToCurrentUser: function(credentialToken, credentialSecret) {
    check(this.userId, String);
    check(credentialToken, String);
    check(credentialSecret, String);

    var result = OAuth._retrievePendingCredential(credentialToken, credentialSecret);

    if (! result)
      throw new Meteor.Error('Oauth failure');

    var updated = Meteor.users.update(this.userId,
      { '$set': { 'services.meteor-developer': result.serviceData } });
  }
});
