angular.module('visitorsGroup')
  .config(function ($stateProvider) {
    $stateProvider
      .state('visitorsGroup', {
        url: '/visitors-group',
        parent: 'index',
        abstract: true,
        templateUrl: 'app/visitors-group/visitors-group.html',
        data: {
          label: 'Visitor Categories',
          menu: true,
          icon: 'fa fa-sitemap',
          link: 'visitorsGroup.all',
          order: 5
        }
      });
  });
