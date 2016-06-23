'use strict';

angular.module('company')
  .config(function ($stateProvider) {
    $stateProvider
      .state('company', {
        url: '/company',
        abstract: true,
        parent: 'index',
        templateUrl: 'app/company/company.html',
        data: {
          label: 'Companies',
          menu: true,
          order: 7,
          link: 'company.all',
          icon: 'fa fa-building'
        },
        resolve: {
          permissions: function ($rootScope, aclService) {
            return aclService.getPermissions($rootScope.currentUser, 'users');
          }
        }
      })
  });
