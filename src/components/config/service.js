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
      url: self.apiUrl(),
      baseUrl: getBaseUrl()
    };

    function isEmpty (value) {
      return value === undefined || value === '' || value === null;
    }

    function getBaseUrl () {
      var protocol = $window.location.protocol;
      var hostname = $window.location.hostname;
      var port = $window.location.port;

      return [
        protocol,
        '//',
        hostname,
        ':',
        port
      ].join('');
    }

  });
