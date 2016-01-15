'use strict';

angular.module('appointments')
  .controller('CheckInCtrl', function (
    appointmentService,
    $stateParams,
    $state
  ) {
    var vm = this;
    appointmentService.get($stateParams._id)
      .then(function (response) {
        vm.item = response;
      })
      .catch(function (reason) {

      });

    vm.checkIn = function (item) {
      appointmentService.saveLog({
        checked_in: new Date().toJSON(),
        appointment: vm.item._id
      })
        .then(function () {
          $state.go('appointments.all')
        })
        .catch(function (reason) {

        });
    }
  })
  .controller('CheckOutCtrl', function (appointmentService) {

  });