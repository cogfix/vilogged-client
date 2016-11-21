angular.module('visitorsGroup')
  .config(function ($stateProvider) {
    $stateProvider
      .state('visitorsGroup.all', {
        url: '/all',
        parent: 'visitorsGroup',
        templateUrl: 'app/visitors-group/all/all.html',
        controller: 'VisitorsGroupAllCtrl',
        controllerAs: 'allCtrl'
      });
  });