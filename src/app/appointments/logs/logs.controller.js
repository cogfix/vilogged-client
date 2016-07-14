'use strict';

angular.module('appointments')
  .controller('CheckInCtrl', function (
    appointmentService,
    $stateParams,
    $state,
    dialogs,
    authService
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
      appointmentService.saveLog({
        checked_in: new Date().toJSON(),
        appointment: vm.item._id,
        label_code: (new Date().getTime()).toString().slice(0, -1)
      })
        .then(function () {
          $state.go('appointments.all');
        })
        .catch(function (reason) {
          console.log(reason);
          if (Object.prototype.toString.call(reason) === '[object Object]' && reason.detail) {
            log.error(reason.detail || reason);
          } else {
            log.error('unknownError');
          }
        });
    };

    vm.checkOut = function () {
      var currentLog =  angular.copy(vm.item.latest);
      var appointment = angular.copy(vm.item);
      appointment.visitor = vm.item.visitor._id;
      appointment.host = vm.item.host._id;
      appointment.is_expired = true;
      currentLog.check_out = new Date().toJSON();
      appointmentService.saveLog(currentLog)
        .then(function () {
          return appointmentService.save(appointment);
        })
        .then(function () {
          $state.go('appointments.all');
        })
        .catch(function (reason) {
          console.log(reason);
          if (Object.prototype.toString.call(reason) === '[object Object]' && reason.detail) {
            log.error(reason.detail || reason);
          } else {
            log.error('unknownError');
          }
        });
    };

    vm.printLabel = function () {
      var dlg = dialogs.create('app/appointments/logs/partials/pass-template.html', 'PrintLabelCtrl', vm.item, {size: 'md'});
      dlg.result.then(function (name) {

      }, function () {

      });
    };

    vm.updateApp = function (appointment, type) {
      console.log(appointment);
      var currentAppointment = angular.copy(vm.item);
      appointment.is_approved = type === 'true';
      appointment.host = vm.item.host._id;
      appointment.visitor = vm.item.visitor._id;
      appointmentService.save(appointment)
        .then(function (response) {
          if (response.is_approved === true) {
            vm.item.status = appointmentService.status.UPCOMING;
          } else if (response.is_approved === false) {
            vm.item.status = appointmentService.status.REJECTED;
          }
          vm.item._rev = response._rev;
          vm.item.is_approved = response.is_approved;
          vm.item.is_expired = response.is_expired;
          if (vm.item.status === appointmentService.status.UPCOMING) {
            appointmentService.sms(currentAppointment, 'approval');
            appointmentService.email(currentAppointment, 'approval');
          }
        })
        .catch(function (reason) {
          console.log(reason);
          if (Object.prototype.toString.call(reason) === '[object Object]' && reason.detail) {
            log.error(reason.detail || reason);
          } else {
            log.error('unknownError');
          }
        })
    };

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
        appointment: appointment._id,
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
