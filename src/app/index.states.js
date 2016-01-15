'use strict';

angular.module('viLogged')
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('root', {
        abstract: true,
        views: {
          root: {
            templateUrl: 'app/index.html',
            controller: 'IndexCtrl',
            controllerAs: 'indexCtrl'
          }
        }
      })
      .state('index', {
        parent: 'root',
        abstract: true,
        views: {
          header: {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbarCtrl'
          },
          sidenav: {
            templateUrl: 'components/sidebar/sidebar.html',
            controller: 'SidebarCtrl',
            controllerAs: 'sidebarCtrl'
          },
          breadcrumbs: {
            templateUrl: 'components/breadcrumbs/breadcrumbs.html',
            controller: 'BreadcrumbsCtrl',
            controllerAs: 'bcCtrl'
          },
          content: {},
          footer: {
            templateUrl: 'components/footer/footer.html',
            controller: 'FooterCtrl',
            controllerAs: 'footerCtrl'
          }
        }
      });
  });
