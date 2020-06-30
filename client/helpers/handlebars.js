Template.registerHelper('isLoggedIn', function () {
  return !!Meteor.user();
});

Template.registerHelper('isAdmin', function () {
  return Meteor.user() && Meteor.user().isAdmin();
});

Template.registerHelper('hasPermission', function(level) {
  return Meteor.user() && Meteor.user().hasPermission(Session.get("book"), level);
});

Template.registerHelper('purchaseUrl', function(level) {
  return Products._transform(Session.get("book")).gumroadPurchaseUrl(level, Meteor.user(), Session.get("code"));
});

Template.registerHelper('flash', function(defaultMessage){
  var flash = Session.get('flash');
  if (!!flash) {
    return '<p class="form-notice form-'+flash.type+'">'+flash.message+'</p>';
  } else if (!!defaultMessage) {
    return '<p class="form-notice">'+defaultMessage+'</p>';
  }
});

Template.registerHelper('log', function(context){
  console.log(context);
});

Template.registerHelper('instance', function () {
  return Template.instance();
});

Template.registerHelper('getState', function (variable) {
  return Template.instance().state.get(variable);
});
