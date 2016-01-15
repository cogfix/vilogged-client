angular.module('appointments')
  .config(function ($stateProvider) {
    $stateProvider
      .state('appointments.profile', {
        url: '/profile',
        parent: 'appointments',
        templateUrl: 'app/appointments/profile/profile.html',
        controller: 'AppointmentsProfileCtrl',
        controllerAs: 'appointmentsCtrl'
      })
      .state('appointments.detail', {
        url: '/detail?_id',
        parent: 'appointments',
        templateUrl: 'app/appointments/profile/profile.html',
        controller: 'AppointmentsProfileCtrl',
        controllerAs: 'appointmentsCtrl'
      })
      .state('appointments.remove', {
        url: '/remove?_id',
        parent: 'appointments',
        templateUrl: 'app/appointments/profile/profile.html',
        controller: 'RemoveAppointmentsProfileCtrl',
        controllerAs: 'removeProfileCtrl'
      });
  });