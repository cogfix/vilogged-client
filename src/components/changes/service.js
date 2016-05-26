'use strict';

angular.module('changes')
  .service('changesService', function (dbService, $rootScope, $interval, config) {
    var TABLE = '_changes';
    var _this = this;
    var INTERVAL = '3000000000';

    _this.get = function (id, option) {
      return dbService.get(TABLE, id, option);
    };

    _this.all = function (option) {
      return dbService.all(TABLE, option);
    };

    _this.hasChanged = function (model, lastCheck) {
      if (!model) {
        return false;
      }
      var options = {
        model: model,
        load: 'changes',
        limit: 1,
        order_by: '-created'
      };
      if (lastCheck) {
        options['last-checked'] = lastCheck;
      }
      return _this.all(options)
        .then(function (response) {
          return response.count > 0;
        });
    };
    
    this.pollForChanges = function (vm, serviceInstance, model) {
      $rootScope.resetTimer = $interval(function () {
        if (!vm.inProgress) {
          vm.inProgress = true;
          var params = {};
          serviceInstance.getState()
            .then(function (response) {
              params = response || params;
              return _this.hasChanged(model, params.lastCheckTime);
            })
            .then(function (response) {
              if (response) {
                vm.updateView()
              } else {
                vm.inProgress = false;
                params.lastCheckTime = new Date().getTime();
                console.log(params);
                return serviceInstance.setState(params)
              }
            })
            .catch(function () {
              vm.inProgress = false;
              params.lastCheckTime = new Date().getTime();
              return serviceInstance.setState(params);
            })

        }
      }, config.refreshIntervals || 3000);
    };

  });
