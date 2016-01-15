'use strict';

angular.module('appointments')
  .controller('AppointmentsAllCtrl', function (
    appointmentService,
    changesService
  ) {
    var vm = this;
    var cache = appointmentService.cache();
    vm.inProgress = false;
    vm.items = [];
    function init () {
      var params = cache.get() || {};
      vm.pagination = params.pagination || {};
      vm.pagination.maxSize = vm.pagination.maxSize || 100;
      vm.pagination.itemsPerPage = vm.pagination.itemsPerPage || 10;
      vm.orderByColumn = params.orderByColumn || {};
      if ((Object.keys(params.orderByColumn || {})).length === 0) {
        vm.orderByColumn.created = vm.orderByColumn.created || true;
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
      var option = {};
      if (angular.isDefined(vm.pagination.currentPage)) {
        option.page = vm.pagination.currentPage;
      } else {
        vm.pagination.currentPage = 1;
      }
      if (angular.isDefined(vm.pagination.itemsPerPage)) {
        option.limit = vm.pagination.itemsPerPage;
      } else {
        vm.pagination.itemsPerPage = 10;
      }

      if (column) {
        var col = sort(column);
        option.order_by = col[column].reverse ? column : ['-', column].join('');
       }

      appointmentService.all(option)
        .then(function (response) {
          vm.items = response.results;
          vm.pagination.totalItems = response.count;
          vm.pagination.numPages = Math.ceil(vm.pagination.totalItems / vm.pagination.itemsPerPage);
          cache.set('pagination', vm.pagination);
          cache.set('orderByColumn', vm.orderByColumn);
          cache.set('lastCheckTime', new Date().getTime());
        })
        .catch(function (reason) {
          console.log(reason);
        });
    };
    vm.status = appointmentService.status;
    vm.updateView();
    changesService.pollForChanges(vm, cache, 'appointments');
  });