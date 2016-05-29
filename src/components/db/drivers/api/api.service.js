angular.module('db')
  .service('apiService', function ($http, configService, $cookies, log, $q, utility) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var BASE_URL = configService.api.url;
    var TIMEOUT = 90000; //1.5 minutes
    var self = this, httpConfig = {
      timeout: TIMEOUT,
      headers: {
        Authorization: ''
      }
    };
  
    this.put = function (table, data) {
      var deferred = $q.defer();

      var url = [BASE_URL, table, data['_id']].join('/');
      $http.put(url, data, updateHeader())
        .then(function (response) {
          var data = response;
          if (response.hasOwnProperty('data')) {
            data = response.data;
          }
          deferred.resolve(data);
        },
        function (reason) {
          if (reason.status === -1 || reason.status === 0) {
            log.error('serverNotAvailable');
          }
          var data = reason;
          if (reason.hasOwnProperty('data')) {
            data = reason.data;
          }
          deferred.reject(data);
        });
      return deferred.promise;
    };
  
    self.post = function (table, data) {
      var deferred = $q.defer();
      $http.post([BASE_URL, table].join('/'), data, updateHeader(table))
        .then(function (response) {
          var data = response;
          if (response.hasOwnProperty('data')) {
            data = response.data;
          }
          deferred.resolve(data);
        },
        function (reason) {
          if (reason.status === -1 || reason.status === 0) {
            log.error('serverNotAvailable');
          }
          var data = reason;
          if (reason.hasOwnProperty('data')) {
            data = reason.data;
          }
          deferred.reject(data);
        });
      return deferred.promise;
    };
  
    self.all = function (table, options) {
      options = options || {};
      var deferred = $q.defer();
      $http.get([[BASE_URL, table].join('/'), prepareUrlParams(options)].join(''), updateHeader())
        .then(function (response) {
          var data = response;
          if (response.hasOwnProperty('data')) {
            data = response.data;
          }
          deferred.resolve(data);
        },
        function (reason) {
          if (reason.status === -1 || reason.status === 0) {
            log.error('serverNotAvailable');
          }
          var data = reason;
          if (reason.hasOwnProperty('data')) {
            data = reason.data;
          }
          deferred.reject(data);
        });

      return deferred.promise;
    };
  
    self.get = function (table, id, options) {
      options = options || {};
      var deferred = $q.defer();
      $http.get([[BASE_URL, table, id].join('/'), prepareUrlParams(options)].join(''), updateHeader())
        .then(function (response) {
          var data = response;
          if (response.hasOwnProperty('data')) {
            data = response.data;
          }
          deferred.resolve(data);
        },
        function (reason) {
          if (reason.status === -1 || reason.status === 0) {
            log.error('serverNotAvailable');
          }
          var data = reason;
          if (reason.hasOwnProperty('data')) {
            data = reason.data;
          }
          deferred.reject(data);
        });

      return deferred.promise;
    };
  
    self.remove = function (table, id, options) {
      //return apiFactory.remove({_table: table, _param: id}).$promise;
      var deferred = $q.defer();
      $http.delete([[BASE_URL, table, id].join('/'), prepareUrlParams(options)].join(''), updateHeader())
        .then(function (response) {
          var data = response;
          if (response.hasOwnProperty('data')) {
            data = response.data;
          }
          deferred.resolve(data);
        },
        function (reason) {
          if (reason.status === -1 || reason.status === 0) {
            log.error('serverNotAvailable');
          }
          var data = reason;
          if (reason.hasOwnProperty('data')) {
            data = reason.data;
          }
          deferred.reject(data);
        });
      return deferred.promise;
    };

    function prepareUrlParams (options) {
      var urlParams = '';
      if (options  && !utility.isEmptyObject(options)) {
        var urlData = [];
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            urlData.push([key, options[key]].join('='));
          }
        }
        if (urlData.length > 0) {
          urlParams = ['?', urlData.join('&')].join('');
        }
      }

      return urlParams;
    }

    function updateHeader (table) {
      var header = {
        Authorization: ['Token', $cookies.getObject('vi-token')].join(' ')
      };
      if (angular.isDefined(table) && table === 'login') {
        delete header.Authorization;
      }
      return {
        timeout: 9000,
        headers: header
      };
    }
  });
