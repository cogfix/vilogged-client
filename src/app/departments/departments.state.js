angular.module('departments')
  .config(function ($stateProvider) {
    $stateProvider
      .state('departments', {
        url: '/departments',
        parent: 'index',
        abstract: true,
        templateUrl: 'app/departments/departments.html',
        data: {
          label: 'Departments',
          menu: true,
          icon: 'fa fa-bank',
          link: 'departments.all',
          order: 6
        }
      });
  });