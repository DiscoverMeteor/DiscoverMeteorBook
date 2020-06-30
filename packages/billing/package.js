Package.describe({
  name: 'billing',
  summary: 'Billing required for the app',
  version: '1.0.0',
});

Npm.depends({stripe: '3.2.0'});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.addFiles('billing-common.js');
  api.addFiles('billing-server.js', 'server');
  
  api.export('Billing');
});


Package.onTest(function(api) {
  api.use(['tinytest', 'billing']);
  api.addFiles('billing-common-tests.js');
});