angular.module('appointments')
  .config(function ($stateProvider) {
    $stateProvider
      .state('appointments.all', {
        url: '/all',
        parent: 'appointments',
        templateUrl: 'app/appointments/all/all.html',
        controller: 'AppointmentsAllCtrl',
        controllerAs: 'allCtrl',
        resolve: {
          currentState: function (appointmentService) {
            return appointmentService.getState()
              .catch(function () {
                return {};
              });
          }
        }
      });
  });
