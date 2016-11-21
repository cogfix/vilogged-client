'use strict';

angular.module('sidebar')
  .controller('SidebarCtrl', function(
    $state,
    config,
    sidebarService
  ) {
    this.name = config.name;
    this.items = sidebarService.get();
  });
