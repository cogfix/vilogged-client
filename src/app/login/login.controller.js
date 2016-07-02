'use strict';

angular.module('login')
  .controller('LoginCtrl', function(
    $state,
    config,
    loginService,
    $rootScope,
    log,
    $scope
  ) {
    var vm = this;
    vm.loginClicked = false;
    $rootScope.loginMode = true;
    vm.credentials = {};

    function loggedInMode (user) {
      vm.loginClicked = false;
      $scope.loginMode = false;
      log.success('authSuccess');
      if (user.is_superuser || user.is_staff) {
        $state.go('home');
      } else {
        $state.go('users.profile');
      }
    }

    vm.login = function () {
      vm.loginClicked = true;
      if (angular.isUndefined(vm.credentials.username) && angular.isUndefined(vm.credentials.password)) {
        vm.loginClicked = false;
        log.error('authInvalid');
      } else {
        loginService.login(vm.credentials.username, vm.credentials.password)
          .then(function (response) {
            $scope.$on('serverResponse', function (scopeInstance, data) {
              $scope.data = data
            });
            if ($scope.data && $scope.data.status !== 401) {
              loggedInMode(response.user);
            } else {
              if (response && response.detail) {
                vm.loginClicked = false;
                log.error(response.detail);
              } else if (response && response.token) {
                loggedInMode(response.user);
              } else {
                vm.loginClicked = false;
                log.error('authInvalid');
              }

            }
          })
          .catch(function (reason) {
            vm.loginClicked = false;
            $scope.loginMode = true;
            if (reason && reason.detail) {
              log.error(reason.detail);
            } else if (reason) {
              log.error('authInvalid');
            }
          })
      }
    }


  });
