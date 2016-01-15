'use strict';

angular.module('changes')
  .service('changesService', function (dbService, $rootScope, $interval) {
    var TABLE = '_changes';
    var _this = this;

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

    this.pollForChanges = function (vm, cacheInstance, model) {
      $rootScope.resetTimer = $interval(function () {
        if (!vm.inProgress) {
          vm.inProgress = true;
          var params = cacheInstance.get() || {};
          _this.hasChanged(model,  params.lastCheckTime)
            .then(function (response) {
              if (response) {
                vm.updateView()
              } else {
                vm.inProgress = false;
                cacheInstance.set('lastCheckTime', new Date().getTime());
              }
            })
            .catch(function () {
              vm.inProgress = false;
              cacheInstance.set('lastCheckTime', new Date().getTime());
            })
        }
      }, 3000);
    };

  });