'use strict';

angular.module('m.config')
  .service('configService', function (config, $window) {
    var self = this;
    self.apiUrl = function () {
      var protocol = config.api.protocol || $window.location.protocol;
      if (!isEmpty(config.api.url)) {
        return config.api.url;
      }
      return [
        protocol,
        '//',
        $window.location.hostname,
        ':',
        config.api.port,
        config.api.path
      ].join('');
    };

    this.api = {
      url: self.apiUrl()
    };

    function isEmpty (value) {
      return value === undefined || value === '' || value === null;
    }
  });
