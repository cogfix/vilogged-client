'use strict';

angular.module('appointments')
  .controller('AppointmentsProfileCtrl', function (appointmentService, authService, $stateParams) {
    var vm = this;
    var id = $stateParams._id;
    if ($stateParams._id) {
      vm.item = appointmentService.get()
    }

  })
  .controller('RemoveAppointmentsProfileCtrl', function (userService, $state, $stateParams, authService) {
    var id = $stateParams._id;
    if (id && authService.currentUser()._id !== id) {
      userService.remove(id)
        .then(function (response) {
          $state.go('appointments.all');
        })
        .catch(function (reason) {
          console.log(reason);
        });
    }

  });