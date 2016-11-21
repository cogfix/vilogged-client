angular.module('visitorsGroup')
  .config(function ($stateProvider) {
    $stateProvider
      .state('visitorsGroup.profile', {
        url: '/profile',
        parent: 'visitorsGroup',
        templateUrl: 'app/visitors-group/profile/profile.html',
        controller: 'VisitorsGroupProfileCtrl',
        controllerAs: 'profileCtrl'
      })
      .state('visitorsGroup.detail', {
        url: '/detail?_id',
        parent: 'visitorsGroup',
        templateUrl: 'app/visitors-group/profile/profile.html',
        controller: 'VisitorsGroupProfileCtrl',
        controllerAs: 'profileCtrl'
      })
      .state('visitorsGroup.remove', {
        url: '/remove?_id',
        parent: 'visitorsGroup',
        templateUrl: 'app/visitors-group/profile/profile.html',
        controller: 'RemoveVisitorsGroupProfileCtrl',
        controllerAs: 'removeProfileCtrl'
      });
  });