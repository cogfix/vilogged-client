angular.module('users')
  .config(function ($stateProvider) {
    $stateProvider
      .state('users', {
        url: '/users',
        parent: 'index',
        abstract: true,
        templateUrl: 'app/users/users.html',
        data: {
          label: 'Users',
          menu: true,
          icon: 'fa fa-users',
          link: 'users.all',
          order: 2
        }
      });
  });