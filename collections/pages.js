Pages = new Meteor.Collection('pages');

if(Meteor.isServer)
  Pages.remove({});