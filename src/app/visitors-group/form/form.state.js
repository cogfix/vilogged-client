'use strict';

angular.module('visitorsGroup')
  .config(function ($stateProvider) {
    $stateProvider
      .state('visitorsGroup.add', {
        parent: 'visitorsGroup',
        url: '/add',
        templateUrl: 'app/visitors-group/form/form.html',
        controller: 'VGFormCtrl',
        controllerAs: 'formCtrl',
        data: data('Add Visitors Group', 'fa fa-plus-square', 'visitorsGroup.all')
      })
      .state('visitorsGroup.edit', {
        parent: 'visitorsGroup',
        url: '/edit?_id',
        templateUrl: 'app/visitors-group/form/form.html',
        controller: 'VGFormCtrl',
        controllerAs: 'formCtrl',
        data: data('Edit Visitors Group', 'fa fa-edit-square', 'visitorsGroup.all')
      });
  });