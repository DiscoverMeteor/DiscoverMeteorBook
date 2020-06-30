var options = Meteor.isServer ? {connection: null} : {};
Interviews = new Meteor.Collection('interviews', options);