'use strict';

angular.module('departments')
  .controller('DepartmentProfileCtrl', function (userService, authService, $stateParams) {
    var vm = this;
    if ($stateParams._id) {
      userService.get($stateParams._id)
        .then(function (response) {
          vm.profile = response;
        })
        .catch(function (reason) {

        });
    } else {
      vm.profile = authService.currentUser();
    }

  })
  .controller('RemoveDepartmentProfileCtrl', function (userService, $state, $stateParams, dialog) {
    var id = $stateParams._id;
    if (id) {
      userService.remove(id)
        .then(function (response) {
          $state.go('departments.all');
        })
        .catch(function (reason) {
          $state.go('departments.all');
          console.log(reason);
        });
    }

  });