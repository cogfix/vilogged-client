'use strict';

angular.module('login')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          login: {
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'loginCtrl'
          }
        }

      })
      .state('logout', {
        url: 'logout',
        parent: 'index',
        controller: function (authService, log, $window) {
          authService.logout();
          $window.location.href = '#/login';
          log.success('logoutSuccess');
        }
      });
  });