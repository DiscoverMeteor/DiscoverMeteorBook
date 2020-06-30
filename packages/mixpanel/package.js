Package.describe("Meteor wrapper for Mixpanel package");

Package.on_use(function (api) {
  api.add_files(['mixpanel-server.js'], 'server');
  api.add_files(['mixpanel-client.js'], 'client');
  if(api.export)
    api.export('Mixpanel');
});

Npm.depends({
  "mixpanel": "0.0.18"
});