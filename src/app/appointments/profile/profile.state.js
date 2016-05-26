angular.module('appointments')
  .config(function ($stateProvider) {
    $stateProvider
      .state('appointments.detail', {
        url: '/detail?_id',
        templateUrl: 'app/appointments/logs/checkin.html',
        controller: 'CheckInCtrl',
        controllerAs: 'logCtrl',
        data: data('Appointment Detail', null, 'appointments.all')

      })
      .state('appointments.remove', {
        url: '/remove?_id',
        parent: 'appointments',
        templateUrl: 'app/appointments/profile/profile.html',
        controller: 'RemoveAppointmentsProfileCtrl',
        controllerAs: 'removeProfileCtrl'
      });
  });
