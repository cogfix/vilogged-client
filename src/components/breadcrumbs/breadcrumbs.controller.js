'use strict';

angular.module('breadcrumbs')
  .controller('BreadcrumbsCtrl', function($state, $rootScope, breadcrumbsService) {
    var vm = this;
    vm.breadcrumbs = breadcrumbsService.getBreadCrumbs($state.current);
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      vm.breadcrumbs = breadcrumbsService.getBreadCrumbs(toState);
    });

  });
