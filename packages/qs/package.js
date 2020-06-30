// https://www.npmjs.org/package/qs

Package.describe("qs package");

Package.on_use(function (api) {
  api.add_files(['qs.js'], ['server']);
  if(api.export)
    api.export('qs');
});

Npm.depends({
  "qs": "0.6.6"
});