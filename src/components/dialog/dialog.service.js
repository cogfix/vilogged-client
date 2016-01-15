'use strict';

angular.module('dialog')
  .service('dialog', function (dialogs, $q) {
    var _this = this;

    _this.confirm = function (message, title, options) {
      var deferred = $q.defer();
      title = title || 'Confirmation Dialog';
      message = message || '';
      options = options || {};
      var defaultOptions = {size: 'sm', animation: true};
      dialogs.confirm(title, message, angular.merge({}, options, defaultOptions)).result
        .then(function (btn) {
          deferred.resolve(btn);
        },
        function (btn) {
          deferred.reject(btn);
        });
      return deferred.promise;
    };
  });