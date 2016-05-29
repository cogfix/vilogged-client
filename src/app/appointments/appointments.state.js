angular.module('appointments')
  .config(function ($stateProvider) {
    $stateProvider
      .state('appointments', {
        url: '/appointments',
        parent: 'index',
        abstract: true,
        templateUrl: 'app/appointments/appointments.html',
        data: {
          label: 'Appointments',
          menu: true,
          icon: 'fa fa-newspaper-o',
          link: 'appointments.all',
          order: 3
        }
      });
  });
