Package.describe("Static Collections package");

Package._transitional_registerBuildPlugin({
  name: "staticCollections",
  use: ['underscore'],
  sources: [
    'plugin/static-collections.js'
  ],
  npmDependencies: {}
});