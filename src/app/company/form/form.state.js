'use strict';


angular.module('company')
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.add', {
        parent: 'company',
        url: '/add',
        templateUrl: 'app/company/form/form.html',
        controller: 'CFormCtrl',
        controllerAs: 'formCtrl',
        data: data('Add Company', 'fa fa-plus-square', 'company.all')
      })
      .state('company.edit', {
        parent: 'company',
        url: '/edit?_id',
        templateUrl: 'app/company/form/form.html',
        controller: 'CFormCtrl',
        controllerAs: 'formCtrl',
        data: data('Edit Company', 'fa fa-edit-square', 'company.all')
      });
  });