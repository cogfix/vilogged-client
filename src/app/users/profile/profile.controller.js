'use strict';

angular.module('users')
  .controller('UserProfileCtrl', function (
    userService,
    authService,
    $stateParams,
    appointmentService,
    utility,
    log
  ) {
    var vm = this;
    var id = $stateParams._id;
    if (id) {
      userService.get(id)
        .then(function (response) {
          vm.profile = response;
        })
        .catch(function (reason) {

        });
    } else {
      vm.profile = authService.currentUser();
    }

    vm.getInProgress = function () {
      id = id || authService.currentUser()._id;
      appointmentService.inProgress({host: id})
        .then(function (response) {

          vm.inProgress = response.results;
        })
    };

    vm.getUpcoming = function () {
      id = id || authService.currentUser()._id;
      appointmentService.upcoming({host: id})
        .then(function (response) {
          vm.upcoming = response.results;
        })
    };

    vm.getAwaitingApproval = function () {
      id = id || authService.currentUser()._id;
      appointmentService.awaitingApproval({host: id})
        .then(function (response) {
          vm.awaitingApproval = response.results;
        })
    };

    vm.getRejected = function () {
      id = id || authService.currentUser()._id;
      appointmentService.rejected({host: id})
        .then(function (response) {
          vm.rejected = response.results;
        })
    };

    vm.timeSince = function (date) {
      return utility.timeSince(date);
    };

    vm.updateApp = function (appointment, type) {
      appointment.is_approved = type === 'true';
      appointment.host = appointment.host._id;
      appointment.visitor = appointment.visitor._id;
      appointmentService.save(appointment)
        .then(function () {
          if (appointment.status === appointmentService.status.PENDING) {
            appointmentService.sms(vm.viewModel, 'approval');
            appointmentService.email(vm.viewModel, 'approval');
          }
          loadAll();
        })
        .catch(function (reason) {
          console.log(reason);
          log.error(reason.detail || reason);
        })
    };

    function loadAll() {
      vm.getRejected();
      vm.getInProgress();
      vm.getUpcoming();
      vm.getAwaitingApproval();
    }
    loadAll();

  })
  .controller('RemoveUserProfileCtrl', function (userService, $state, $stateParams, authService) {
    var id = $stateParams._id;
    if (id && authService.currentUser()._id !== id) {
      userService.remove(id)
        .then(function () {
          $state.go('users.all');
        })
        .catch(function (reason) {
          console.log(reason);
        });
    }
  });
