'use strict';

angular.module('visitorsGroup')
  .controller('VisitorsGroupAllCtrl', function (
    visitorsGroupService,
    authService,
    $state,
    log
  ) {
    var user = authService.currentUser();
    if (!user.is_superuser || !user.is_staff) {
      log.error('unauthorizedAccess');
      $state.go('users.profile');
    }
    var vm = this;
    vm.users = [];
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
      date_joined: true
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

      visitorsGroupService.all(option)
        .then(function (response) {
          vm.items = response.results;
          vm.pagination.totalItems = response.count;
          vm.pagination.numPages = Math.ceil(vm.pagination.totalItems / vm.pagination.itemsPerPage);
        })
        .catch(function (reason) {
          console.log(reason);
        });
    };

    vm.updateView();
  });
