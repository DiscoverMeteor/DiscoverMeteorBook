if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

_.defaults(Meteor.settings, {
  meteorDeveloper: {
    appId: 'foo',
    appSecret: 'bar'
  },
  stripe: {
    sk: 'baz'
  }
});


// setup google login
ServiceConfiguration.configurations.remove({
  service: "meteor-developer"
});
ServiceConfiguration.configurations.insert({
  service: "meteor-developer",
  clientId: Meteor.settings.meteorDeveloper.appId,
  secret: Meteor.settings.meteorDeveloper.appSecret
});

Billing.setStripeSecret(Meteor.settings.stripe.sk);
