GAnalytics = {}

GAnalytics.configure = function (gaSettings) {
  // Common
  GAnalytics.config = {};

  GAnalytics.config.debug = !! gaSettings.debug;

  // cookie settings
  if(typeof gaSettings.cookieName !== 'undefined')
    GAnalytics.config.cookieName = gaSettings.cookieName;

  if(typeof gaSettings.cookieDomain !== 'undefined')
    GAnalytics.config.cookieDomain = gaSettings.cookieDomain;
  
  if(typeof gaSettings.cookieExpires !== 'undefined')
    GAnalytics.config.cookieExpires = gaSettings.cookieExpires;

  // if gaConfig is still empty, default it to 'auto'
  if(Object.keys(GAnalytics.config).length === 0)
    GAnalytics.config = 'auto';


  // Client
  if (Meteor.isClient) {
    load(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', gaSettings.account, GAnalytics.config);

    if (gaSettings.trackInterests)
      ga('require', 'displayfeatures');

    if (gaSettings.trackInPage)
      ga('require', 'linkid', 'linkid.js');
  }


  // Server
  if (Meteor.isServer) {
    var ua = Npm.require('universal-analytics');
    GAnalytics.visitor = ua(gaSettings.account);    
  }
}

// XXX: this was pointless?
// GAnalytics.pageview = function(pageLocation) {
//   console.log("Analytics code is not loaded yet.");
// };
// GAnalytics.event = function(category, action, label, value) {
//   console.log("Analytics code is not loaded yet.");
// };

load = function(i,s,o,g,r,a,m) {
  i['GoogleAnalyticsObject']=r;
  i[r]=i[r] || function(){
    (i[r].q=i[r].q||[]).push(arguments)}
  ,i[r].l=1*new Date();
    a=s.createElement(o), m=s.getElementsByTagName(o)[0];
    a.async=1;
    a.src=g;
    m.parentNode.insertBefore(a,m)
};

GAnalytics.pageview = function(pageLocation) {
  // debug
  if (GAnalytics.config.debug)
    console.log("Logging pageview: "+pageLocation)

  if (Meteor.isClient) {
    if(!pageLocation) {
      pageLocation = window.location.pathname;
    }
    ga('send', 'pageview', pageLocation);
  } else {
    GAnalytics.visitor.pageview(pageLocation).send();
  }
}

GAnalytics.event = function(category, action, label, value) {
  // debug
  if (GAnalytics.config.debug)
    console.log("Logging event: "+category+" | "+ action + " | " + label + " | " + value)

  if (Meteor.isClient) {
    ga('send', 'event', category, action, label, value);
  } else {
    GAnalytics.visitor.event(category, action, label, value).send();
  }
}

Meteor.methods({
  serverAnalyticsTest: function () {
    if(Meteor.isServer)
      GAnalytics.event("Server-side test", "Server-side test", "Server-side analytics logging test");
  }
})