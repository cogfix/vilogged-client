'use strict';

angular.module('visitors')
  .config(function ($stateProvider) {
    $stateProvider
      .state('visitors.add', {
        parent: 'visitors',
        url: '/add?visitor',
        templateUrl: 'app/visitors/form/form.html',
        controller: 'VFormCtrl',
        controllerAs: 'formCtrl',
        data: data('Add Visitor', 'fa fa-plus-square', 'visitors.all')
      })
      .state('visitors.edit', {
        parent: 'visitors',
        url: '/edit?_id&visitor',
        templateUrl: 'app/visitors/form/form.html',
        controller: 'VFormCtrl',
        controllerAs: 'formCtrl',
        data: data('Edit Visitor', 'fa fa-edit-square', 'visitors.all')
      });
  });