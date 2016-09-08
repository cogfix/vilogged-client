'use strict';

angular.module('appointments')
  .controller('CheckInCtrl', function (
    appointmentService,
    $stateParams,
    $state,
    dialogs,
    authService,
    appointmentLogsService,
    log
  ) {
    var vm = this;
    var currentUser = authService.currentUser();
    vm.teamMembers = [];
    vm.can = {
      print: (currentUser.is_superuser || currentUser.is_staff),
      checkIn:  (currentUser.is_superuser || currentUser.is_staff),
      checkOut:  (currentUser.is_superuser || currentUser.is_staff)
    };

    vm.status = appointmentService.status;
    appointmentService.get($stateParams._id)
      .then(function (response) {
        vm.item = response;
        vm.teamMembers = response.teams;
      })
      .catch(function (reason) {

      });

    vm.checkIn = function () {
      appointmentLogsService.checkIn(vm, appointmentService, $state, log);
    };

    vm.checkOut = function () {
      appointmentLogsService.checkOut(vm, appointmentService, $state, log);
    };

    vm.printLabel = function () {
      appointmentService.get($stateParams._id)
        .then(function (response) {
          vm.item = response;
          var dlg = dialogs.create('app/appointments/logs/partials/pass-template.html', 'PrintLabelCtrl', response, {size: 'md'});
          dlg.result.then(function (name) {
    
          }, function () {
    
          });
        })
        .catch(function (reason) {
      
        });
    };

    vm.updateApp = function (appointment, type) {
      appointmentLogsService.updateApp(vm, appointment, type,  appointmentService);
    };

  })
  .controller('CheckOutCtrl', function (
    appointmentService,
    $state,
    appointmentLogsService,
    appointmentResponse,
    log
  ) {
    var vm = this;
    vm.item = appointmentResponse;
    appointmentLogsService.checkOut(vm, appointmentService, $state, log);
  })
  .controller('PrintLabelCtrl', function (
    $scope,
    $modalInstance,
    data,
    $timeout,
    appointmentService
  ) {
    $scope.appointment = data;
    var appointment = $scope.appointment.logs[0] || {};
    var labelCode =  (new Date().getTime()).toString().slice(0, -1);
    if (appointment.label_code) {
      labelCode = appointment.label_code.toString();
    } else {
      // save label if not exists
      appointmentService.saveLog({
        appointment: data._id,
        label_code: labelCode
      })
        .catch(function (reason) {
          console.log(reason);
        });
    }

    if (labelCode.length > 12) {
      labelCode = labelCode.slice(0, -1)
    }
    $timeout(function () {
      JsBarcode("#barcode")
        .options({font: "OCR-B"}) // Will affect all barcodes
        .EAN13(labelCode, {
          fontSize: 11,
          textMargin: 0,
          height: 20
        })
        .render();

    }, 2000);
    $scope.printThis = function () {
      $timeout(function () {
        jQuery( "#printThisElement" ).print();
      }, 200);

    }
  });
