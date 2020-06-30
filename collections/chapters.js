var options = Meteor.isServer ? {connection: null} : {};
Chapters = new Meteor.Collection('chapters', options);