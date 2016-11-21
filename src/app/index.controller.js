'use strict';

angular.module('viLogged')
  .controller('IndexCtrl', function($rootScope, log) {
    $rootScope.loginMode = false;
    function stateChangeError(event) {
      log.error('stateChangeError', event);
    }
    $rootScope.$on('$stateChangeError', stateChangeError);
  });
