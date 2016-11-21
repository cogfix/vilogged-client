'use strict';

angular.module('company')
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.all', {
        url: '/all',
        parent: 'company',
        templateUrl: 'app/company/all/all.html',
        controller: 'CompanyAllCtrl',
        controllerAs: 'allCtrl'
      })
  });