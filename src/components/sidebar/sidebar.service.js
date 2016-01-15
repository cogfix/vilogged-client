'use strict';

angular.module('sidebar')
  .service('sidebarService', function($state) {
    this.get = function() {
      var menuItems = [];
      var seen = {};
      var states = $state.get();
      var i = states.length;
      while (i--) {
        var state = states[i];
        if (state.hasOwnProperty('data') && state.data.hasOwnProperty('label') && state.data.hasOwnProperty('menu')) {
          if (!seen.hasOwnProperty(state.data.label) && state.data.menu) {
            seen[state.data.label] = true;
            var data = state.data;
            data.link = state.data.link || state.name;
            menuItems.push(state.data);
          }

        }
      }
      menuItems.sort(function (a, b) {
        return a.order - b.order;
      });
      return menuItems;
    };
  });
