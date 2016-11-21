'use strict';

angular.module('visitors')
  .controller('VisitorProfileCtrl', function (visitorService, authService, $stateParams) {
    var vm = this;
    if ($stateParams._id) {
      visitorService.get($stateParams._id)
        .then(function (response) {
          vm.profile = response;
        })
        .catch(function (reason) {

        });
    } else {
      vm.profile = authService.currentUser();
    }

  })
  .controller('RemoveVisitorProfileCtrl', function (visitorService, $state, $stateParams, authService) {
    var id = $stateParams._id;
    if (id && authService.currentUser()._id !== id) {
      visitorService.remove(id)
        .then(function (response) {
          $state.go('visitors.all');
        })
        .catch(function (reason) {
          console.log(reason);
        });
    }

  });