'use strict';

angular.module('visitorsGroup')
  .controller('VGFormCtrl', function (
    visitorsGroupService,
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

    vm.model = visitorsGroupService.model;

    vm.form = formService.modelToForm(vm.model, COLUMN);
    var id = $stateParams._id;

    if (id) {
      visitorsGroupService.get(id)
        .then(function (response) {
          vm.viewModel = response;
        })
        .catch(function (reason) {
          console.log(reason);
        });
    }

    vm.save = function () {
      vm.isSaving = true;
      visitorsGroupService.validate(vm.viewModel)
        .then(function (response) {
          if (utility.isEmptyObject(response)) {
            visitorsGroupService.save(vm.viewModel)
              .then(function () {
                vm.isSaving = false;
                $state.go('visitorsGroup.all');
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
        visitorsGroupService.validateField(vm.viewModel[fieldName], fieldName, vm.viewModel['_id'])
          .then(function (response) {
            vm.errorMsg[fieldName] = response;
          })
          .catch(function (reason) {
            console.log(reason);
          })
      }
    };

    vm.cancel = function () {
      $state.go('visitorsGroup.all');
    };
  });
