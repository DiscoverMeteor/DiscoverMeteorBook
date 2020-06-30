// XXX: this should be part of the pack
if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

if (typeof Meteor.settings.public === 'undefined')
  Meteor.settings.public = {};

_.defaults(Meteor.settings.public, {
  ga: {
    account: "UA-38246482-3",
    cookieDomain: "discovermeteor.com",
    debug: true
  },
  stripe: {
    pk: 'pk_test_7KfR3w6gvUjFOen1bIKwbDUo'
  }
});

GAnalytics.configure(Meteor.settings.public.ga);

if (Meteor.isClient) {
  Meteor.startup(function() {
    Stripe.setPublishableKey(Meteor.settings.public.stripe.pk);
  });
}