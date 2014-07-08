Package.describe({
  name: 'latency',
  summary: 'Simulate latency in Meteor apps'
});

Package.on_use(function (api) {
   api.add_files('latency.js', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('latency');
  api.use('tinytest');
  api.add_files('latency_tests.js');
});
