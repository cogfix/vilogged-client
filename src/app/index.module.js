'use strict';

angular
	.module('viLogged', [
		'ngSanitize',
    'ngCookies',
		'core',
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
    'ngVPrint'
	])
	.run(function ($rootScope, $state, log, authService, $window, $interval) {
		log.persist.load();
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      if ($rootScope.resetTimer) {
        $interval.cancel($rootScope.resetTimer);
      }

      if (!authService.loggedIn()) {
        $window.location.href = '#/login';
      } else {
        $rootScope.currentUser = authService.currentUser();
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
          if (response.status >= 400) {
            return $q.reject(response);
          }
          return response;
        },
        'responseError': function(responseError) {
          $rootScope.$broadcast('serverResponse', responseError);
          return $q.reject(responseError);
        }
      };
    });
  }]);
