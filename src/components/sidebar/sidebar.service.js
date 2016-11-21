'use strict';

angular.module('sidebar')
  .service('sidebarService', function($state, authService) {
    this.get = function() {
      var user = authService.currentUser();
      var menuItems = [];
      var seen = {};
      var states = $state.get();
      var i = states.length;
      while (i--) {
        var state = _.cloneDeep(states[i]);
        if (state.hasOwnProperty('data') && state.data.hasOwnProperty('label') && state.data.hasOwnProperty('menu')) {
          if (!seen.hasOwnProperty(state.data.label) && state.data.menu) {
            seen[state.data.label] = true;
            var data = state.data;
            data.link = state.data.link || state.name;
            if (state.name === 'settings') {
              state.data.menu = user.is_superuser;
            }
            if (['company', 'visitorsGroup', 'users', 'departments'].indexOf(state.name) !== -1) {
              state.data.menu = user.is_superuser || user.is_staff;
            }
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
