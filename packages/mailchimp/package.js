Package.describe("Mailchimp package");

Package.on_use(function (api) {
  api.add_files(['mailchimp.js'], 'server');
  if(api.export)
    api.export('MailChimpAPIObject');
});

Npm.depends({
  "mailchimp": "0.9.5"
});