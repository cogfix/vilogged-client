'use strict';

/**
 * @name utility
 * @desc for sharing common functions and service
 */
angular.module('utility')
  .service('utility', function ($filter, config) {

    this.formatDate = function (date, format) {
      var dateFormat = format || config.dateFormat;
      return $filter('date')(new Date(date), dateFormat);
    };

    this.takeFirst = function (list) {
      return list[0];
    };

    /**
     * This takes a date object, extract only "yyyy-MM-dd" part
     * and return it as date object.
     *
     * Needed to set HTML 5 date input field in AngularJS.
     * see https://docs.angularjs.org/api/ng/input/input%5Bdate%5D
     */
    this.extractDate = function (date) {
      return new Date(this.formatDate(date));
    };


    /**
     * We use this because angular.isDate() returns True if given a date
     * that is invalid. e.g angular.isDate(undefined);
     * @param date
     * @returns {boolean}
     */
    this.isValidDate = function (date) {
      return (date && date !== null && (new Date(date)).toString() !== 'Invalid Date');
    };

    this.isEmptyObject = function (obj) {
      return toString.call(obj) === '[object Object]' && Object.keys(obj).length === 0;
    };

    this.contains = function (str, subStr) {
      return str.indexOf(subStr) !== -1;
    };

    this.capitalize = function (str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    this.hashBy = function (list, key) {
      var hash = {};
      list.forEach(function (elem) {
        var id = elem[key];
        hash[id] = elem;
      });
      return hash;
    };

    this.getUUID = function () {
      var now = Date.now();
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        // jshint bitwise: false
        var r = (now + Math.random() * 16) % 16 | 0;
        now = Math.floor(now / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });
    };

    this.chunk = function (array, size) {
      size = size || 1;
      var arrays = [];
      while (array.length > 0) {
        arrays.push(array.splice(0, size));
      }
      return arrays;
    };

    this.timeSince = function(date) {
      if (!(date && date !== null && (new Date(date)).toString() !== 'Invalid Date')) {
        return 'Never';
      }
      if (typeof date !== 'object') {
        date = new Date(date);
      }

      var seconds = Math.floor((new Date() - date) / 1000);
      var intervalType;

      var interval = Math.floor(seconds / 31536000);
      if (interval >= 1) {
        intervalType = 'year';
      } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
          intervalType = 'month';
        } else {
          interval = Math.floor(seconds / 86400);
          if (interval >= 1) {
            intervalType = 'day';
          } else {
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
              intervalType = "hour";
            } else {
              interval = Math.floor(seconds / 60);
              if (interval >= 1) {
                intervalType = "minute";
              } else {
                interval = seconds;
                intervalType = "second";
              }
            }
          }
        }
      }

      if (interval > 1 || interval === 0) {
        intervalType += 's';
      }

      return interval + ' ' + intervalType;
    };

  });
