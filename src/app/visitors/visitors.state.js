angular.module('visitors')
  .config(function ($stateProvider) {
    $stateProvider
      .state('visitors', {
        url: '/visitors',
        parent: 'index',
        abstract: true,
        templateUrl: 'app/visitors/visitors.html',
        data: {
          label: 'Visitors',
          menu: true,
          icon: 'fa fa-street-view',
          link: 'visitors.all',
          order: 4
        },
        resolve: {
          permissions: function ($rootScope, aclService) {
            return aclService.getPermissions($rootScope.currentUser, 'visitors');
          }
        }
      });
  });
