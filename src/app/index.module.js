'use strict';

angular
	.module('viLogged', [
		'ngSanitize',
    'ngCookies',
    'ngAnimate',
		'core',
    'angular-loading-bar',
		'breadcrumbs',
		'sidebar',
		'navbar',
		'footer',
		'home',
		'log',
		'auth',
    'login',
		'users',
		'changes',
		'validation',
    'departments',
		'visitors',
		'appointments',
		'company',
		'vi.camera',
		'visitorsGroup',
    'dialog',
		'db',
		'utility',
		'ui.calendar',
    'settings',
    'cache',
    'ngVPrint',
    'ngCsv',
    'acl',
    'local'
	])
	.run(function (
    $rootScope,
    $state,
    log,
    authService,
    $window,
    $interval
  ) {
		$rootScope.$on('loggedIn', function (event, data) {
      $rootScope.currentUser = data.user;
    });
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      if ($rootScope.resetTimer) {
        $interval.cancel($rootScope.resetTimer);
      }
      if (
        Object.prototype.toString.call($rootScope.currentUser) === '[object Object]' &&
        (Object.keys($rootScope.currentUser)).length > 0
      ) {
        //nothing here
      } else {
        localforage.getItem('vi-user')
          .then(function (response) {
            if (
              response !== null && response !== undefined &&
              Object.prototype.toString.call(response) === '[object Object]' &&
              response._id
            ) {
              $rootScope.currentUser = response;
            }  else {
              authService.logout();
            }
          })
          .catch(function () {
            authService.logout();
          });
      }
		});
	})
	.config( [
		'$compileProvider',
		function ( $compileProvider ) {
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
			// Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
		}
	])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(function($rootScope, $q) {
      return {
        'response': function (response) {
          $rootScope.$broadcast('serverResponse', response);
          return response;
        },
        'responseError': function(responseError) {
          $rootScope.$broadcast('serverResponse', responseError);
          return $q.reject(responseError);
        }
      };
    });
  }])
  .config(function () {
    localforage.config({
      /*driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()*/
      name        : 'viLogged',
      version     : 1.0,
      size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName   : 'localStore', // Should be alphanumeric, with underscores.
      description : 'local storage db for viLogged'
    });
  })
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#site-loading-bar-custom';
    // cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
    cfpLoadingBarProvider.latencyThreshold = 10;
  }]);
