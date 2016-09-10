'use strict';

angular.module('appointments')
  .controller('AppointmentsAllCtrl', function (
    appointmentService,
    changesService,
    userService,
    currentState,
    dialog,
    log,
    utility,
    table,
    $filter,
    permissions
  ) {
    var vm = this;
    var params = currentState || {};
    vm.permissions = permissions;
    vm.currentUser = userService.currentUser();
    vm.items = [];
    vm.search = {};
    vm.inProgress = false;
    vm.filterFields = table.appointments;
    function init () {
      vm.pagination = params.pagination || {};
      vm.pagination.maxSize = vm.pagination.maxSize || 100;
      vm.pagination.itemsPerPage = vm.pagination.itemsPerPage || 10;
      vm.pagination.currentPage = vm.pagination.currentPage || 1;
      vm.orderByColumn = params.orderByColumn || {};
      if ((Object.keys(params.orderByColumn || {})).length === 0) {
        vm.orderByColumn.date_joined = vm.orderByColumn.date_joined || {reverse: true};
      }

    }
    init();
    function sort (column) {
      if (vm.orderByColumn.hasOwnProperty(column) && utility.is.object(vm.orderByColumn[column])) {
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

    vm.updateView = function (input) {
      var urlParams = input || {};
      if (utility.is.string(input)) {
        urlParams = {column: input};
      }
      vm.inProgress = true;
      var option = getOptions(urlParams);
      appointmentService.all(option)
        .then(function (response) {
          vm.items = response.results;
          vm.pagination.totalItems = response.count;
          vm.pagination.itemsPerPage = parseInt(vm.pagination.itemsPerPage, 10);
          vm.pagination.numPages = Math.ceil(parseInt(vm.pagination.totalItems, 10) / parseInt(vm.pagination.itemsPerPage, 10));
          params.pagination = vm.pagination;
          params.orderByColumn = vm.orderByColumn;
          params.lastCheckTime = new Date().getTime();
          appointmentService.setState(params)
            .catch(function (err) {
              console.log(err)
            });
          vm.inProgress = false;
        })
        .catch(function (reason) {
          vm.inProgress = false;
          log.error(reason);
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

    function getOptions (param) {
      param = param || {};
      var column = param.column;
      var page = param.page;
      var filterParams = param.filterParams;
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
      if (filterParams && utility.is.object(filterParams)) {
        for (var key in filterParams) {
          if (filterParams.hasOwnProperty(key)) {
            option[key] = filterParams[key];
          }
        }
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

    vm.startSearch = function () {
      vm.is_active_search = (Object.keys(vm.search)).length > 0;
      var option = {filterParams: {}};
      var search = Object.keys(vm.search);
      if (search.length > 0) {
        for (var key in vm.search) {
          if (vm.search.hasOwnProperty(key) && vm.search[key] !== undefined && vm.search[key].length > 2) {
            option.filterParams[key] = vm.search[key];
          } else if (vm.search.hasOwnProperty(key) && vm.search[key] !== undefined && ['start_date', 'end_date'].indexOf(key) !== -1) {
            option.filterParams[key] = $filter('date')(vm.search[key], 'yyyy-MM-dd');
          }
        }
      }

      if ((Object.keys(option.filterParams)).length > 0) {
        option.filterParams.search = true;
        vm.updateView(option);
      } else {
        vm.updateView();
      }
    };

    vm.clear = function () {
      vm.search = {};
      vm.updateView();
    };

    vm.searchPage = function () {
      var option = {filterParams: {}};
      if (vm.q !== undefined && vm.q !== '') {
        option.filterParams.q = vm.q;
        vm.updateView(option);
      }
    };

    function openDatePicker ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      this.opened = !this.opened;
    }

    vm.date = {
      start_date: {
        opened: false,
        open: openDatePicker
      },
      end_date: {
        opened: false,
        open: openDatePicker
      }
    };
  });
