angular.module('users')
  .config(function ($stateProvider) {
    $stateProvider
      .state('users.profile', {
        url: '/profile',
        parent: 'users',
        templateUrl: 'app/users/profile/profile.html',
        controller: 'UserProfileCtrl',
        controllerAs: 'profileCtrl',
        data: data('Profile', 'fa fa-user', 'users.all')
      })
      .state('users.detail', {
        url: '/detail?_id',
        parent: 'users',
        templateUrl: 'app/users/profile/profile.html',
        controller: 'UserProfileCtrl',
        controllerAs: 'profileCtrl',
        data: data('Profile', 'fa fa-user', 'users.all')
      })
      .state('users.remove', {
        url: '/remove?_id',
        parent: 'users',
        templateUrl: 'app/users/profile/profile.html',
        controller: 'RemoveUserProfileCtrl',
        controllerAs: 'removeProfileCtrl'
      });
  });