angular.module('visitors')
  .config(function ($stateProvider) {
    $stateProvider
      .state('visitors.profile', {
        url: '/profile',
        parent: 'visitors',
        templateUrl: 'app/visitors/profile/profile.html',
        controller: 'VisitorProfileCtrl',
        controllerAs: 'profileCtrl',
        data: data('Profile', 'fa fa-user-square', 'visitors.all')
      })
      .state('visitors.detail', {
        url: '/detail?_id',
        parent: 'visitors',
        templateUrl: 'app/visitors/profile/profile.html',
        controller: 'VisitorProfileCtrl',
        controllerAs: 'profileCtrl',
        data: data('Profile', 'fa fa-user-square', 'visitors.all')
      })
      .state('visitors.remove', {
        url: '/remove?_id',
        parent: 'visitors',
        templateUrl: 'app/visitors/profile/profile.html',
        controller: 'RemoveVisitorProfileCtrl',
        controllerAs: 'removeProfileCtrl'
      });
  });
