'use strict';

angular.module('appointments')
  .config(function ($stateProvider) {
    $stateProvider
      .state('appointments.add', {
        parent: 'appointments',
        url: '/add?visitor',
        templateUrl: 'app/appointments/form/form.html',
        controller: 'AFormCtrl',
        controllerAs: 'formCtrl',
        data: data('Add Appointments', 'fa fa-plus-square', 'appointments.all')
      })
      .state('appointments.edit', {
        parent: 'appointments',
        url: '/edit?_id&visitor',
        templateUrl: 'app/appointments/form/form.html',
        controller: 'AFormCtrl',
        controllerAs: 'formCtrl',
        data: data('Edit Appointments', 'fa fa-plus-square', 'appointments.all')
      });
  });