'use strict';

angular.module('breadcrumbs')
  .service('breadcrumbsService', function($state, utility) {
    var _this = this;
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

    _this.get = function (name) {
      return allStates[name] || {};
    };

    _this.all = function () {
      return allStates;
    };

    _this.getBreadCrumbs = function (current) {
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
      _this.getParent(breadcrumbs, data.parent);
      return breadcrumbs;
    };

    _this.getParent = function (breadcrumbs, parentName) {
      var parent = _this.get(parentName);
      var data = parent.data || {};
      if (!utility.isEmptyObject(parent)) {
        if (parent.hasOwnProperty('data')) {
          breadcrumbs.unshift({
            name: parent.data.label,
            url: parent.data.link
          });
        }
        _this.getParent(breadcrumbs, data.parent);
      }
    };
  });
