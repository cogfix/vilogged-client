angular.module('db')
  .service('driverService', function (config, apiService, couchDBService, pouchDBbService) {
    var _this = this;

    _this.getService = function () {
      return {
        api: apiService,
        couchDB: couchDBService,
        pouchDB: pouchDBbService
      }
    };

    _this.getDriver = function () {
      return config.driver || 'api';
    };

    _this.get = function () {
      var services = _this.getService();
      var driver = _this.getDriver();
      if (!services.hasOwnProperty(driver)) {
        return services['pouchDB']
      }
      return services[driver];
    };

  });