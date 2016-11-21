'use strict';

angular.module('appointments')
  .service('appointmentLogsService', function (utility) {
    var self = this;
    
    self.checkIn = function (vm, appointmentService, $state, log) {
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
    
    self.checkOut = function (vm, appointmentService, $state, log) {
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
          if (utility.is.object(reason) && reason.detail) {
            log.error(reason.detail || reason);
          } else {
            log.error('unknownError');
          }
        });
    };
    
    self.updateApp = function (vm, appointment, type,  appointmentService) {
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
          if (utility.is.object(reason) && reason.detail) {
            log.error(reason.detail || reason);
          } else {
            log.error('unknownError');
          }
        })
    }
  });