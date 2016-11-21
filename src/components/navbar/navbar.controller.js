'use strict';

angular.module('navbar')
  .controller('NavbarCtrl', function($state, config, navbarService) {

    this.name = config.name;
    this.items = navbarService.get();


  });
