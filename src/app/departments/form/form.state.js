'use strict';

angular.module('departments')
  .config(function ($stateProvider) {
    $stateProvider
      .state('departments.add', {
        parent: 'departments',
        url: '/add',
        templateUrl: 'app/departments/form/form.html',
        controller: 'DFormCtrl',
        controllerAs: 'formCtrl',
        data: data('Add Department', 'fa fa-plus-square', 'departments.all')
      })
      .state('departments.edit', {
        parent: 'departments',
        url: '/edit?_id',
        templateUrl: 'app/departments/form/form.html',
        controller: 'DFormCtrl',
        controllerAs: 'formCtrl',
        data: data('Edit Department', 'fa fa-edit-square', 'departments.all')
      });
  });