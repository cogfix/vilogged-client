'use strict';

/**
 * @name utility
 * @desc for sharing common functions and service
 */
angular.module('cache')
  .service('cache', function ($cookies) {
    var self = this;
    var CACHE_KEY = 'vi-cache-params';
    self.VIEW_KEY = '';
  
    self.get = function () {
      var cached = $cookies.getObject(CACHE_KEY) || {};
      return cached.hasOwnProperty(self.VIEW_KEY) ? cached[self.VIEW_KEY] : {};
    };
  
    self.set = function (key, value) {
      var cached = $cookies.getObject(CACHE_KEY) || {};
      cached = cached.hasOwnProperty(self.VIEW_KEY) ? cached[self.VIEW_KEY] : {};
      cached[key] = value;
      var forView = {};
      forView[self.VIEW_KEY] = cached;
      return $cookies.putObject(CACHE_KEY, forView);
    };

    this.getView = function () {
      return self.VIEW_KEY;
    }
  });
