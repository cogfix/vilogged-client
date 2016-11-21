'use strict';

angular.module('departments')
  .controller('DepartmentAllCtrl', function (departmentService, dialog, log) {
    var vm = this;
    vm.items = [];
    vm.pagination = {
      maxSize: 100
    };

    function sort (column) {
      if (vm.orderByColumn[column]) {
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

      departmentService.all(option)
        .then(function (response) {
          vm.items = response.results;
          vm.pagination.totalItems = response.count;
          vm.pagination.numPages = Math.ceil(vm.pagination.totalItems / vm.pagination.itemsPerPage);
        })
        .catch(function (reason) {
          console.log(reason);
        });
    };
    vm.remove = function (id) {
      dialog.confirm('Do you want to remove this record permanently?')
        .then(function () {

          departmentService.remove(id)
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
  });