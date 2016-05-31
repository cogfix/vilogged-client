'use strict';

angular.module('settings')
  .config(function ($stateProvider) {
    $stateProvider
      .state('settings', {
        parent: 'index',
        url: '/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settingsCtrl',
        data: {
          label: 'System Settings',
          menu: false,
          link: 'settings',
          icon: 'fa fa-cogs',
          order: 8
        }
      })
  });
