'use strict';

angular.module('users')
  .controller('UserAllCtrl', function (
    userService,
    dialog,
    log,
    changesService,
    currentState,
    utility,
    table,
    permissions,
    $state
  ) {
    var vm = this;
    var params = currentState || {};
    vm.permissions = permissions;
    if (!vm.permissions.read) {
      $state.go('users.profile');
    }
    vm.items = [];
    vm.search = {};
    vm.inProgress = false;
    vm.filterFields = table.users;
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
      if (vm.orderByColumn.hasOwnProperty(column) && Object.prototype.toString.call(vm.orderByColumn[column]) === '[object Object]') {
        vm.orderByColumn[column].reverse = !vm.orderByColumn[column].reverse;
      } else {
        vm.orderByColumn = {};
        vm.orderByColumn[column]= {reverse: true};
      }
      params.orderByColumn = vm.orderByColumn;
      userService.setState(params)
        .catch(function (err) {
          console.log(err)
        });
      return vm.orderByColumn;
    }

    vm.updateView = function (input) {
      var urlParams = input || {};
      if (Object.prototype.toString.call(input) === '[object String]') {
        urlParams = {column: input};
      }
      vm.inProgress = true;
      var option = getOptions(urlParams);
      userService.all(option)
        .then(function (response) {
          vm.items = response.results;
          vm.pagination.totalItems = response.count;
          vm.pagination.itemsPerPage = parseInt(vm.pagination.itemsPerPage, 10);
          vm.pagination.numPages = Math.ceil(parseInt(vm.pagination.totalItems, 10) / parseInt(vm.pagination.itemsPerPage, 10));
          params.pagination = vm.pagination;
          params.orderByColumn = vm.orderByColumn;
          params.lastCheckTime = new Date().getTime();
          userService.setState(params)
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
    changesService.pollForChanges(vm, userService, 'userprofile');

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
      if (filterParams && Object.prototype.toString.call(filterParams) === '[object Object]') {
        for (var key in filterParams) {
          if (filterParams.hasOwnProperty(key)) {
            option[key] = filterParams[key];
          }
        }
      }
      return option;
    }

    vm.header = [
      'Username',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Department',
      'Floor'
    ];
    vm.getList = function () {
      var options = getOptions('date_joined', 'all');
      return userService.all(options)
        .then(function (response) {
          return response.results.map(function (row) {
            return {
              username: row.username,
              first_name: row.first_name,
              last_name: row.last_name,
              email: row.email,
              phone: row.phone,
              department: row.department.name,
              floor: row.department.floor
            };
          });
        });
    };
    vm.filename = utility.getFileName('users');

    vm.startSearch = function () {
      var option = {filterParams: {}};
      var search = Object.keys(vm.search);
      if (search.length > 0) {
        for (var key in vm.search) {
          if (vm.search.hasOwnProperty(key) && vm.search[key] !== undefined && vm.search[key].length > 2) {
            option.filterParams[key] = vm.search[key];
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
  });
