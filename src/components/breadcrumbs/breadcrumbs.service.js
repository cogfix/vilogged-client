'use strict';

angular.module('breadcrumbs')
  .service('breadcrumbsService', function($state, utility) {
    var self = this;
    var states = $state.get();
    var allStates = listToObject();

    function listToObject() {
      var stateMap = {};
      var i = states.length;
      while (i--) {
        var row = states[i];
        stateMap[row.name] = row;
      }

      return stateMap;
    }
  
    self.get = function (name) {
      return allStates[name] || {};
    };
  
    self.all = function () {
      return allStates;
    };
  
    self.getBreadCrumbs = function (current) {
      var breadcrumbs = [];
      var data = current.data || {};
      if (current.name !== 'home') {
        if (current.hasOwnProperty('data')) {
          breadcrumbs.push({
            name: current.data.label,
            url: current.name,
            last: true
          });
        }
      }
      self.getParent(breadcrumbs, data.parent);
      return breadcrumbs;
    };
  
    self.getParent = function (breadcrumbs, parentName) {
      var parent = self.get(parentName);
      var data = parent.data || {};
      if (!utility.isEmptyObject(parent)) {
        if (parent.hasOwnProperty('data')) {
          breadcrumbs.unshift({
            name: parent.data.label,
            url: parent.data.link
          });
        }
        self.getParent(breadcrumbs, data.parent);
      }
    };
  });
