'use strict';

angular.module('users')
  .controller('FormCtrl', function (
    userService,
    $state,
    $stateParams,
    utility,
    formService,
    departmentService,
    $scope,
    $window,
    $timeout,
    dialogs,
    aclService
  ) {
    var currentUser = userService.currentUser();
    //debugger;
    var COLUMN = 2;
    var vm = this;
    var id = $stateParams._id;
    vm.permissions = aclService.hasPermission(currentUser, 'users');
    if (!vm.permissions.create && id !== currentUser._id) {
      $state.go('users.profile');
    }
    vm.errorMsg = {};
    vm.viewModel = {};
    vm.passwordMode = false;
    vm.column = (12/COLUMN);
    vm.model = _.clone(userService.model);
    if ($state.current.name === 'users.changePassword') {
      vm.column = 12;
      vm.passwordMode = true;
      for (var modelKey in vm.model) {
        if (vm.model.hasOwnProperty(modelKey) && ['password', 'password2'].indexOf(modelKey) === -1) {
          vm.model[modelKey].hidden = true;
        }
      }
    }
    departmentService.choices()
      .then(function (response) {
        vm.model.department.choices = response;
      })
      .catch(function () {

      });

    vm.form = formService.modelToForm(vm.model, COLUMN, {
      instance: this
    });

    if (vm.passwordMode) {
      id = currentUser._id;
    }

    if (id) {
      userService.get(id)
        .then(function (response) {
          vm.viewModel = response;
          vm.viewModel.department = vm.viewModel.department._id || '';
          vm.model.password.required = false;
          vm.model.password2.required = false;
          vm.form = formService.modelToForm(vm.model, COLUMN, {
            instance: this
          });
        })
        .catch(function (reason) {
          console.log(reason);
        });
    }

    vm.save = function () {
      userService.validate(vm.viewModel)
        .then(function (response) {
          if (utility.isEmptyObject(response)) {
            userService.save(vm.viewModel)
              .then(function (response) {
                userService.updateCurrentUser(response);
                $state.go('users.all');
              })
              .catch(function (reason) {
                angular.merge(vm.errorMsg, reason)
              });
          } else {
            vm.errorMsg = response;
          }
        })
        .catch(function (reason) {
          console.log(reason);
        });
    };
    vm.validateField = function (fieldName) {
      vm.errorMsg[fieldName] = '';
      if (vm.model.hasOwnProperty(fieldName)) {
        userService.validateField(vm.viewModel[fieldName], fieldName, vm.viewModel['_id'])
          .then(function (response) {
            response = response || [];
            if (response.length === 0 && ['password', 'password2'].indexOf(fieldName) !== -1) {
              return userService.validatePasswordMatch(vm.viewModel['password'], vm.viewModel['password2'])
            }
            return response;
          })
          .then(function (response) {
            if (toString.call(response) === '[object Object]') {
              vm.errorMsg['password'] = response.password || [];
              vm.errorMsg['password2'] = response.password2 || [];
            } else {
              vm.errorMsg[fieldName] = response;
            }

          })
          .catch(function (reason) {
            console.log(reason);
          })
      }
    };

    vm.placeholder = formService.placeholder;

    vm.cancel = function () {
      $state.go('users.all');
    };

    vm.openImageDialog = function () {
      var dlg = dialogs.create(
        'app/users/form/partials/camera/camera.html',
        'UModalImage',
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
  .controller('UModalImage', function (
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
      $modalInstance.close($scope.takeImage);
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

