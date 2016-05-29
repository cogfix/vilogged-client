angular.module('db')
  .service('driverService', function (config, apiService, couchDBService, pouchDBbService) {
    var self = this;
  
    self.getService = function () {
      return {
        api: apiService,
        couchDB: couchDBService,
        pouchDB: pouchDBbService
      }
    };
  
    self.getDriver = function () {
      return config.driver || 'api';
    };
  
    self.get = function () {
      var services = self.getService();
      var driver = self.getDriver();
      if (!services.hasOwnProperty(driver)) {
        return services['pouchDB']
      }
      return services[driver];
    };

  });
