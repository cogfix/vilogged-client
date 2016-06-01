'use strict';

angular.module('visitors')
  .controller('VFormCtrl', function (
    visitorService,
    companyService,
    $state,
    $stateParams,
    utility,
    visitorsGroupService,
    formService,
    $scope,
    $window,
    $timeout,
    dialogs
  ) {
    var COLUMN = 2;
    var vm = this;
    vm.upload = {status: true};
    vm.errorMsg = {};
    vm.viewModel = {};
    vm.viewModel.company = vm.viewModel.company || {};
    vm.column = (12/COLUMN);
    vm.companyResponse = {};
    vm.phone = {
      prefixes: formService.phonePrefixes()
    };
    vm.model = visitorService.model;
    vm.form = formService.modelToForm(vm.model, COLUMN);
    var id = $stateParams._id;

    if (id) {
      visitorService.get(id)
        .then(function (response) {
          vm.viewModel = response;
          vm.viewModel['company.name'] = vm.viewModel.company.name;
          vm.viewModel['company.address'] = vm.viewModel.company.address;
          var phone = visitorService.recoverPhone(vm.viewModel.phone);
          vm.viewModel = angular.merge({}, vm.viewModel, phone);
        })
        .catch(function (reason) {
          console.log(reason);
        });
    }

    visitorsGroupService.choices()
      .then(function (response) {
        vm.model.type.choices = response;
      })
      .catch(function (reason) {

      });

    vm.save = function () {
      vm.viewModel.phone = visitorService.getPhone(vm.viewModel['phone.prefix'], vm.viewModel['phone.suffix']);
      visitorService.validate(vm.viewModel)
        .then(function (response) {
          response = visitorService.updateForPhone(response);
          response = visitorService.updateForPrefix(response, vm.viewModel['phone.prefix']);
          if (utility.isEmptyObject(response)) {
            if (!visitorService.isEmpty(vm.viewModel['company.name'])) {
              vm.viewModel.company = {
                name: vm.viewModel['company.name']
              }
            }

            if (!visitorService.isEmpty(vm.viewModel['company.address']) && !visitorService.isEmpty(vm.viewModel['company.name'])) {
              vm.viewModel.company.address = vm.viewModel['company.address'];
            }
            visitorService.save(vm.viewModel)
              .then(function () {
                $state.go('visitors.all');
              })
              .catch(function (reason) {
                angular.merge(vm.errorMsg, reason);
              });
          } else {
            vm.errorMsg = response;
          }
        })
        .catch(function (reason) {
          console.log(reason);
        });
    };

    vm.cancel = function () {
      $state.go('visitors.all');
    };
    vm.validateField = function (fieldName) {
      vm.errorMsg[fieldName] = '';
      if (vm.model.hasOwnProperty(fieldName)) {
        if (fieldName === 'phone.suffix') {
          if (vm.viewModel['phone.prefix'] === 'Others') {
            vm.model['phone.suffix'].minLength = 6;
            vm.model['phone.suffix'].maxLength = 15;
          } else {
            vm.model['phone.suffix'].maxLength = 7;
            vm.model['phone.suffix'].minLength = 7;
          }
        } else if (fieldName === 'phone.prefix' && vm.viewModel['phone.prefix'] === 'Others') {
          return [];
        }
        visitorService.validateField(vm.model[fieldName], vm.viewModel[fieldName], vm.viewModel['_id'])
          .then(function (response) {
            vm.errorMsg[fieldName] = fieldName === 'phone.prefix' && response.length > 0 ? ['Please select from list'] : response;
          })
          .catch(function (reason) {
            console.log(reason);
          })
      }

      if (
        (fieldName === 'phone.prefix' || fieldName === 'phone.suffix') &&
        (!visitorService.isEmpty(vm.viewModel['phone.prefix']) &&
        !visitorService.isEmpty(vm.viewModel['phone.suffix']))
      ) {
        visitorService.validateField(vm.viewModel[fieldName], fieldName, vm.viewModel['_id'])
          .then(function (response) {
            if (response.length) {
              vm.errorMsg['phone'] = response;
            } else {
              vm.errorMsg['phone'] = '';
            }
          })
          .catch(function (reason) {
            console.log(reason);
          })
      }

    };

    vm.getCompanies = function (str) {
      return companyService.all({q: str})
        .then(function (response) {
          return response.results.map(function (row) {
            vm.companyResponse[row.name] = row;
            return row.name;
          });
        })
        .catch(function (reason) {

        })
    };
    vm.updateCompany = function ($item) {
      vm.viewModel['company.address'] = vm.companyResponse[$item].address;
    };
    vm.placeholder = formService.placeholder;

    vm.openImageDialog = function () {
      var dlg = dialogs.create(
        'app/visitors/form/partials/camera/camera.html',
        'VModalImage',
        {vm: vm, $timeout: $timeout},
        {size: 'lg'},
        'formCtrl'
      ).result;

      dlg
        .then(function (res) {
          vm.viewModel.image = res;
        })
        .catch(function (err) {
          console.log(err)
        })
    };

  })
  .controller('VModalImage', function (
    $scope,
    $modalInstance,
    data,
    $window,
    $timeout,
    cameraService
  ) {
    var vm = data.vm;
    // var $timeout = data.$timeout;
    $scope.takeImage = vm.viewModel.image;

    $scope.closeCameraNow = function () {
      offCammera();
      vm.upload.status = $modalInstance.close($scope.takeImage);
    };

    $scope.$on('picTaken', function(event, data){
      $scope.takeImage = data.image;
    });

    $scope.$on('camSuccess', function () {
      $scope.videoStream = cameraService.instance.stream.getVideoTracks()[0];
    });

    $scope.closeWindow = function () {
      offCammera();
      $modalInstance.dismiss('closed');
    };

    function offCammera () {
      $scope.videoStream.stop();
      cameraService.instance = {};
    }

    $scope.setFiles = function (element, field) {
      var fileToUpload = element.files[0];
      if (fileToUpload.type.match('image*')) {
        var reader = new $window.FileReader();
        reader.onload = function (theFile) {
          $timeout(function () {
            var img = document.createElement("img");
            img.src = theFile.target.result;
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var MAX_WIDTH = 280;
            var MAX_HEIGHT = 300;
            var width = img.width;
            var height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx2 = canvas.getContext("2d");
            ctx2.drawImage(img, 0, 0, width, height);
            vm.viewModel.image = canvas.toDataURL("image/png");
            $scope.takeImage =  canvas.toDataURL("image/png");
          }, 1000)
        };
        reader.readAsDataURL(fileToUpload);
      }
    };

  });
