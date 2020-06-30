Package.describe({
  summary: "Publish pageviews and events to Google Analytics using the new analytics.js code.",
  version: "0.2.1",
  name: "local-analytics"
});

Npm.depends({'universal-analytics': '0.3.6'});

Package.onUse(function (api) {

  api.addFiles(['analytics.js']);
  
  api.export(['GAnalytics']);
  
});