'use strict';

angular.module('visitors')
  .controller('VisitorAllCtrl', function (
    visitorService,
    dialog,
    log,
    utility
  ) {
    var vm = this;
    vm.users = [];
    vm.pagination = {
      maxSize: 100
    };

    function sort (column) {
      if (vm.orderByColumn.hasOwnProperty(column) && Object.prototype.toString.call(vm.orderByColumn[column]) === '[object Object]') {
        vm.orderByColumn[column].reverse = !vm.orderByColumn[column].reverse;
      } else {
        vm.orderByColumn = {};
        vm.orderByColumn[column]= {reverse: true};
      }

      return vm.orderByColumn;
    }

    vm.orderByColumn = {
      created: true
    };


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

      visitorService.all(option)
        .then(function (response) {
          vm.visitors = response.results;
          vm.pagination.totalItems = response.count;
          vm.pagination.numPages = Math.ceil(vm.pagination.totalItems / vm.pagination.itemsPerPage);
        })
        .catch(function (reason) {
          console.log(reason);
        });
    };

    vm.updateView();

    vm.remove = function (id) {
      dialog.confirm('Do you want to remove this record permanently?')
        .then(function () {
          visitorService.remove(id)
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

    vm.header = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'Address'
    ];
    vm.getList = function () {
      var options = getOptions('created', 'all');
      return visitorService.all(options)
        .then(function (response) {
          return response.results.map(function (row) {
            return {
              first_name: row.first_name,
              last_name: row.last_name,
              email: row.email,
              phone: row.phone,
              company: row.company.name,
              address: row.company.address
            };
          });
        });
    };
    vm.filename = utility.getFileName('visitors');
  });
