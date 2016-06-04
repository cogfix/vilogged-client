'use strict';

angular.module('appointments')
  .controller('CheckInCtrl', function (
    appointmentService,
    $stateParams,
    $state,
    dialogs
  ) {
    var vm = this;
    vm.status = appointmentService.status;
    appointmentService.get($stateParams._id)
      .then(function (response) {
        vm.item = response;
      })
      .catch(function (reason) {

      });

    vm.checkIn = function () {
      appointmentService.saveLog({
        checked_in: new Date().toJSON(),
        appointment: vm.item._id,
        label_code: (new Date().getTime()).toString().splice(0, -1)
      })
        .then(function () {
          $state.go('appointments.all')
        })
        .catch(function (reason) {

        });
    }

    vm.printLabel = function () {
      var dlg = dialogs.create('app/appointments/logs/partials/pass-template.html', 'PrintLabelCtrl', vm.item, 'lg');

      dlg.result.then(function (name) {

      }, function () {

      });
    }
  })
  .controller('PrintLabelCtrl', function ($scope, $modalInstance, data, $timeout) {

    $scope.appointment = data;
    var appointment = $scope.appointment.logs[0] || {};
    var labelCode = appointment.label_code.toString();
    if (labelCode.length > 12) {
      labelCode = labelCode.slice(0, -1)
    }
    //JsBarcode("#barcode", "Hi!");
    $timeout(function () {
      JsBarcode("#barcode")
        .options({font: "OCR-B"}) // Will affect all barcodes
        .EAN13(labelCode, {
          fontSize: 11,
          textMargin: 0,
          height: 20
        })
        .render();

    }, 2000)

  })
  .controller('CheckOutCtrl', function (appointmentService) {

  });
