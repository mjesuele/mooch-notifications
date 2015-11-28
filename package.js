/* global Package */

Package.describe({
  name: 'mooch:notifications',
  summary: 'Provides a simple API for creating notifications',
  version: '0.1.0',
  git: 'https://github.com/mjesuele/meteor-notifications',
});

Package.onUse(function(api) {
  // Meteor releases below this version are not supported
  api.versionsFrom('1.2.0.1');

  // Core packages and 3rd party packages
  api.use('check');
  api.use('ddp');
  api.use('ecmascript');
  api.use('tracker');
  api.use('aldeed:collection2@2.5.0');

  // The files of this package
  api.addFiles('shared/index.js', ['client', 'server']);
  api.addFiles('server/index.js', 'server');

  // The variables that become global for users of your package
  api.export('Notifications', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use(['sanjo:jasmine@0.20.2']);
  api.use('mooch:notifications');
  api.addFiles('tests/shared/index.js', ['client', 'server']);
});
