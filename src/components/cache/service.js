'use strict';

/**
 * @name utility
 * @desc for sharing common functions and service
 */
angular.module('cache')
  .service('cache', function ($cookies) {
    var _this = this;
    var CACHE_KEY = 'vi-cache-params';
    _this.VIEW_KEY = '';

    _this.get = function () {
      var cached = $cookies.getObject(CACHE_KEY) || {};
      return cached.hasOwnProperty(_this.VIEW_KEY) ? cached[_this.VIEW_KEY] : {};
    };

    _this.set = function (key, value) {
      var cached = $cookies.getObject(CACHE_KEY) || {};
      cached = cached.hasOwnProperty(_this.VIEW_KEY) ? cached[_this.VIEW_KEY] : {};
      cached[key] = value;
      var forView = {};
      forView[_this.VIEW_KEY] = cached;
      return $cookies.putObject(CACHE_KEY, forView);
    };

    this.getView = function () {
      return _this.VIEW_KEY;
    }
  });
