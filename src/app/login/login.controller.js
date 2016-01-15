'use strict';

angular.module('login')
  .controller('LoginCtrl', function($state, config, loginService, $rootScope, log, $window) {
    $rootScope.loginMode = true;
    var vm = this;
    vm.credentials = {};

    vm.login = function () {
      if (angular.isUndefined(vm.credentials.username) && angular.isUndefined(vm.credentials.password)) {
        log.error('authInvalid');
      } else {
        loginService.login(vm.credentials.username, vm.credentials.password)
          .then(function () {
            $state.go('home');
            log.success('authSuccess');
          })
      }
    }


  });
