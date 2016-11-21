angular.module('departments')
  .config(function ($stateProvider) {
    $stateProvider
      .state('departments.all', {
        url: '/all',
        parent: 'departments',
        templateUrl: 'app/departments/all/all.html',
        controller: 'DepartmentAllCtrl',
        controllerAs: 'allCtrl'
      });
  });