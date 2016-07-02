'use strict';

angular.module('company')
  .controller('CFormCtrl', function (
    companyService,
    $state,
    $stateParams,
    utility,
    formService
  ) {
    var COLUMN = 1;
    var vm = this;
    vm.errorMsg = {};
    vm.viewModel = {};
    vm.column = (12/COLUMN);
    vm.isSaving = false;

    vm.model = companyService.model;

    vm.form = formService.modelToForm(vm.model, COLUMN);
    var id = $stateParams._id;

    if (id) {
      companyService.get(id)
        .then(function (response) {
          vm.viewModel = response;
        })
        .catch(function (reason) {
          console.log(reason);
        });
    }

    vm.save = function () {
      vm.isSaving = true;
      companyService.validate(vm.viewModel)
        .then(function (response) {
          if (utility.isEmptyObject(response)) {
            companyService.save(vm.viewModel)
              .then(function () {
                vm.isSaving = false;
                $state.go('company.all');
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
        companyService.validateField(vm.viewModel[fieldName], fieldName, vm.viewModel['_id'])
          .then(function (response) {
            vm.errorMsg[fieldName] = response;
          })
          .catch(function (reason) {
            console.log(reason);
          })
      }
    };
    vm.cancel = function () {
      $state.go('company.all');
    };
  });
