'use strict';

angular.module('users')
  .controller('UserAllCtrl', function (
    userService,
    dialog,
    log,
    changesService,
    currentState,
    utility
  ) {
    var vm = this;
    var params = currentState || {};
    vm.users = [];
    vm.inProgress = false;
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

    vm.updateView = function (column) {
      vm.inProgress = true;
      var option = getOptions(column);
      userService.all(option)
        .then(function (response) {
          vm.users = response.results;
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

    vm.updateView();
    changesService.pollForChanges(vm, userService, 'userprofile');
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
  });
