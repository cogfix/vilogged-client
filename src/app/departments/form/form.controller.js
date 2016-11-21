'use strict';

angular.module('departments')
  .controller('DFormCtrl', function (
    userService,
    $state,
    $stateParams,
    utility,
    formService,
    departmentService
  ) {
    var COLUMN = 1;
    var vm = this;
    vm.errorMsg = {};
    vm.viewModel = {};
    vm.column = (12/COLUMN);
    vm.isSaving = false;
    vm.model = departmentService.model;

    vm.form = formService.modelToForm(vm.model, COLUMN);
    var id = $stateParams._id;

    if (id) {
      departmentService.get(id)
        .then(function (response) {
          vm.viewModel = response;
        })
        .catch(function (reason) {
          console.log(reason);
        });
    }

    vm.save = function () {
      vm.isSaving = true;
      departmentService.validate(vm.viewModel)
        .then(function (response) {
          if (utility.isEmptyObject(response)) {
            departmentService.save(vm.viewModel)
              .then(function (response) {
                vm.isSaving = false;
                $state.go('departments.all');
              })
              .catch(function (reason) {
                vm.isSaving = false;
                angular.merge(vm.errorMsg, reason)
              });
          } else {
            vm.isSaving = false;
            vm.errorMsg = response;
          }
        })
        .catch(function (reason) {
          vm.isSaving = false;
          console.log(reason);
        });
    };
    vm.validateField = function (fieldName) {
      vm.errorMsg[fieldName] = '';
      if (vm.model.hasOwnProperty(fieldName)) {
        departmentService.validateField(vm.viewModel[fieldName], fieldName, vm.viewModel['_id'])
          .then(function (response) {
            vm.errorMsg[fieldName] = response;
          })
          .catch(function (reason) {
            console.log(reason);
          })
      }
    };
    vm.cancel = function () {
      $state.go('departments.all');
    };
  });
