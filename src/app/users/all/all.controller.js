'use strict';

angular.module('users')
  .controller('UserAllCtrl', function (
    userService,
    dialog,
    log,
    changesService
  ) {
    var cache = userService.cache();
    var vm = this;
    vm.users = [];
    vm.inProgress = false;
    function init () {
      var params = cache.get() || {};
      vm.pagination = params.pagination || {};
      vm.pagination.maxSize = vm.pagination.maxSize || 100;
      vm.pagination.itemsPerPage = vm.pagination.itemsPerPage || 10;
      vm.orderByColumn = params.orderByColumn || {};
      if ((Object.keys(params.orderByColumn || {})).length === 0) {
        vm.orderByColumn.date_joined = vm.orderByColumn.date_joined || true;
      }

    }
    init();
    function sort (column) {
      if (vm.orderByColumn[column]) {
        vm.orderByColumn[column].reverse = !vm.orderByColumn[column].reverse;
      } else {
        vm.orderByColumn = {};
        vm.orderByColumn[column]= {reverse: true};
      }
      cache.set('orderByColumn', vm.orderByColumn);
      return vm.orderByColumn;
    }

    vm.updateView = function (column) {
      vm.inProgress = true;
      var option = {};
      if (angular.isDefined(vm.pagination.currentPage)) {
        option.page = vm.pagination.currentPage;
      } else {
        option.page = 1;
      }
      if (angular.isDefined(vm.pagination.itemsPerPage)) {
        option.limit = vm.pagination.itemsPerPage;
      } else {
        option.limit = 10;
      }

      if (column) {
        var col = sort(column);
        option.order_by = col[column].reverse ? column : ['-', column].join('');
       }

      userService.all(option)
        .then(function (response) {
          vm.users = response.results;
          vm.pagination.totalItems = response.count;
          vm.pagination.numPages = Math.ceil(parseInt(vm.pagination.totalItems, 10) / parseInt(vm.pagination.itemsPerPage, 10));
          cache.set('pagination', vm.pagination);
          cache.set('orderByColumn', vm.orderByColumn);
          cache.set('lastCheckTime', new Date().getTime());
          vm.inProgress = false;
        })
        .catch(function (reason) {
          vm.inProgress = false;
          console.log(reason);
        });
    };

    vm.remove = function (id) {
      dialog.confirm('Do you want to remove this record permanently?')
        .then(function () {
          userService.remove(id)
            .then(function () {
              vm.updateView();
              log.success('recordRemovedSuccessfully');
            })
            .catch(function (reason) {
              log.error(reason.detail || reason);
            })
        })
    };

    vm.updateView();
    changesService.pollForChanges(vm, cache, 'userprofile');
  });