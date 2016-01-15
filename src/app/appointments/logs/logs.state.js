'use strict';

angular.module('appointments')
  .config(function ($stateProvider) {
    $stateProvider
      .state('appointments.checkin', {
        url: '/checkin?_id',
        templateUrl: 'app/appointments/logs/checkin.html',
        controller: 'CheckInCtrl',
        controllerAs: 'logCtrl'
      })
      .state('appointments.checkout', {
        url: '/checkout?_id',
        templateUrl: 'app/appointments/logs/checkout.html',
        controller: 'CheckOutCtrl',
        controllerAs: 'logCtrl'
      });
  });