angular.module('departments')
  .config(function ($stateProvider) {
    $stateProvider
      .state('departments.profile', {
        url: '/profile',
        parent: 'departments',
        templateUrl: 'app/departments/profile/profile.html',
        controller: 'DepartmentProfileCtrl',
        controllerAs: 'profileCtrl'
      })
      .state('departments.detail', {
        url: '/detail?_id',
        parent: 'departments',
        templateUrl: 'app/departments/profile/profile.html',
        controller: 'UserProfileCtrl',
        controllerAs: 'profileCtrl'
      })
      .state('departments.remove', {
        url: '/remove?_id',
        parent: 'departments',
        templateUrl: 'app/departments/profile/profile.html',
        controller: 'RemoveUserProfileCtrl',
        controllerAs: 'removeProfileCtrl'
      });
  });