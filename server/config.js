Accounts.emailTemplates.siteName = "Discover Meteor";
Accounts.emailTemplates.from = "Discover Meteor <hello@discovermeteor.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "[Discover Meteor] Create your account to access the book";
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
  var string =  "Thanks for buying Discover Meteor! \n"+
                "Just click the link below to create your member account"+
                "and access the book's contents:\n\n "+url;
  return string;
};