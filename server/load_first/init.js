// reinitialize products on startup

Meteor.startup(function () {
  Products.remove({});
  var dmBookId = Products.mutate.insert({
    siteKey: 'dm',
    key: 'dmBook',
    name: 'Discover Meteor',
    levels: [
      { key: 'free', name: 'Free Edition', price: 0, description: "The first four chapters of the book." },
      { key: 'starter', name: 'Starter Edition', price: 0, description: "The first eight chapters of the book." },
      { key: 'book', name: 'Standard Edition', price: 29, description: "The whole book, including 14 chapters and 11 sidebars."},
      { key: 'full', name: 'Full Edition', price: 89, description: "The whole book plus <strong>four extra chapters</strong>." },
      { key: 'premium', name: 'Premium Edition', price: 179, description: "The Full Edition, plus <strong>a Discover Meteor t-shirt</strong> and extra content.", disabled: true}
    ]
  });
});