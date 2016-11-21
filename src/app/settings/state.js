'use strict';

angular.module('settings')
  .config(function ($stateProvider) {
    $stateProvider
      .state('settings', {
        parent: 'index',
        url: '/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'formCtrl',
        data: {
          label: 'System Settings',
          menu: true,
          link: 'settings',
          icon: 'fa fa-cogs',
          order: 8
        },
        resolve: {
          permissions: function ($rootScope, aclService) {
            return aclService.getPermissions($rootScope.currentUser, 'users');
          }
        }
      })
  });
