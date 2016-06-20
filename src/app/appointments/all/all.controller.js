'use strict';

angular.module('appointments')
  .controller('AppointmentsAllCtrl', function (
    appointmentService,
    changesService,
    currentState,
    dialog,
    log,
    utility
  ) {
    var vm = this;
    var cache = appointmentService.cache();
    var params = currentState || {};
    vm.inProgress = false;
    vm.items = [];
    function init () {
      var params = cache.get() || {};
      vm.pagination = params.pagination || {};
      vm.pagination.maxSize = vm.pagination.maxSize || 100;
      vm.pagination.itemsPerPage = vm.pagination.itemsPerPage || 10;
      vm.orderByColumn = params.orderByColumn || {};
      if ((Object.keys(params.orderByColumn || {})).length === 0) {
        vm.orderByColumn.created = vm.orderByColumn.created || {reverse: true};
      }

    }
    init();

    function sort (column) {
      if (vm.orderByColumn.hasOwnProperty(column) && Object.prototype.toString.call(vm.orderByColumn[column]) === '[object Object]') {
        vm.orderByColumn[column].reverse = !vm.orderByColumn[column].reverse;
      } else {
        vm.orderByColumn = {};
        vm.orderByColumn[column]= {reverse: true};
      }
      params.orderByColumn = vm.orderByColumn;
      appointmentService.setState(params)
        .catch(function (err) {
          console.log(err)
        });
      return vm.orderByColumn;
    }


    vm.updateView = function (column) {
      var option = getOptions(column);
      appointmentService.all(option)
        .then(function (response) {
          vm.items = response.results;
          vm.pagination.totalItems = response.count;
          vm.pagination.numPages = Math.ceil(vm.pagination.totalItems / vm.pagination.itemsPerPage);
          params.pagination = vm.pagination;
          params.orderByColumn = vm.orderByColumn;
          params.lastCheckTime = new Date().getTime();
          appointmentService.setState(params)
            .catch(function (err) {
              console.log(err)
            });
        })
        .catch(function (reason) {
          console.log(reason);
        });
    };
    vm.status = appointmentService.status;
    vm.updateView();
    changesService.pollForChanges(vm, appointmentService, 'appointments');

    vm.remove = function (id) {
      dialog.confirm('Do you want to remove this record permanently?')
        .then(function () {
          appointmentService.remove(id)
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
    changesService.pollForChanges(vm, appointmentService, 'appointments');

    function getOptions (column, page) {
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

      if (page) {
        option.page = page;
      }

      if (column) {
        var col = sort(column);
        option.order_by = col[column].reverse ? column : ['-', column].join('');
      }
      return option;
    }

    vm.header = [
      'Host Name',
      'Visitors Name',
      'Date',
      'Start Time',
      'End Time',
      'Host Department',
      'Floor'
    ];
    vm.getList = function () {
      var options = getOptions('created', 'all');
      return appointmentService.all(options)
        .then(function (response) {
          return response.results.map(function (row) {
            return {
              host: [row.host.first_name, row.host.last_name].join(' '),
              visitor: [row.visitor.first_name, row.visitor.last_name].join(' '),
              date: row.start_date,
              start_time: row.start_time,
              end_time: row.end_time,
              department: row.host.department.name,
              floor: row.host.department.floor
            };
          });
        });
    };
    vm.filename = utility.getFileName('appointments');
  });
