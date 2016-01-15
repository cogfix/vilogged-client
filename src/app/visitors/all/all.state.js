angular.module('visitors')
  .config(function ($stateProvider) {
    $stateProvider
      .state('visitors.all', {
        url: '/all',
        parent: 'visitors',
        templateUrl: 'app/visitors/all/all.html',
        controller: 'VisitorAllCtrl',
        controllerAs: 'visitorAllCtrl'
      });
  });