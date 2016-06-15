'use strict';

angular.module('appointments')
  .service('appointmentService', function (
    dbService,
    validationService,
    cache,
    pouchdb,
    $filter,
    utility,
    messenger
  ) {
    var TABLE = dbService.tables.APPOINTMENT;
    var CACHEDB = [TABLE, '_cache'].join('');
    var self = this;

    self.model = {
      visitor: validationService.BASIC({
        required: true,
        fieldName: 'visitor',
        label: 'Visitor',
        formType: 'typeahead-remote'
      }),
      host: validationService.BASIC({
        required: true,
        fieldName: 'host',
        label: 'Host',
        formType: 'typeahead-remote'
      }),
      start_date: validationService.BASIC({
        required: true,
        fieldName: 'start_date',
        pattern: '/^[a-zA-Z]/',
        label: 'Appointment Start Date',
        formType: 'date'
      }),
      end_date: validationService.BASIC({
        required: true,
        fieldName: 'end_date',
        pattern: '/^[a-zA-Z]/',
        label: 'Appointment End Date',
        formType: 'date'
      }),
      start_time: validationService.BASIC({
        required: true,
        fieldName: 'start_time',
        label: 'Appointment Start time',
        formType: 'time'
      }),
      end_time: validationService.BASIC({
        required: true,
        fieldName: 'end_time',
        serviceInstance: self,
        label: 'Appointment End Time',
        formType: 'time'
      }),
      representing: validationService.BASIC({
        required: false,
        fieldName: 'representing',
        serviceInstance: self,
        label: 'You are Representing who?',
        formType: 'text'
      }),
      purpose: validationService.BASIC({
        required: false,
        label: 'Purpose of Appointment',
        fieldName: 'purpose',
        formType: 'select',
        choices: [
          {value: 'personal', text: 'Personal'},
          {value: 'official', text: 'Official'},
          {value: 'others', text: 'Others'}
        ]
      }),
      is_approved:  validationService.BASIC({
        required: false,
        label: 'Approved',
        formType: 'checkbox',
        fieldName: 'is_approved',
        hidden: true
      }),
      is_expired:  validationService.BASIC({
        required: false,
        label: 'Expired',
        formType: 'checkbox',
        fieldName: 'is_expired',
        hidden: true
      }),
      entrance:  validationService.BASIC({
        required: false,
        label: 'Entrance',
        formType: 'select',
        fieldName: 'entrance'
      }),
      escort_required:  validationService.BASIC({
        required: false,
        label: 'Escort Required ?',
        fieldName: 'escort_required',
        formType: 'checkbox'
      })
    };

    self.get = function (id, option) {
      return dbService.get(TABLE, id, option);
    };

    self.all = function (option) {
      return dbService.all(TABLE, option);
    };

    self.remove = function (id, option) {
      return dbService.remove(TABLE, id, option);
    };

    self.save = function (id, option) {
      return dbService.save(TABLE, id, option);
    };

    self.getLog = function (id, option) {
      return dbService.get(dbService.tables.APPOINTMENT_LOGS, id, option);
    };

    self.allLogs = function (options) {
      return dbService.all(dbService.tables.APPOINTMENT_LOGS, options);
    };

    self.saveLog = function (id, options) {
      return dbService.save(dbService.tables.APPOINTMENT_LOGS, id, options);
    };

    self.validateField = function (fieldData, fieldName, id) {
      return validationService.validateField(self.model[fieldName], fieldData, id);
    };

    self.validate = function (object) {
      return validationService.validateFields(self.model, object, object._id)
        .then(function (response) {
          return validationService.eliminateEmpty(angular.merge({}, response));
        });
    };

    self.dateTimeValidation = function (startTime, endTime, type) {
      var errorMsg = {};
      var msg = [];
      if (!validationService.isEmpty(startTime) && !validationService.isEmpty(endTime)) {
        startTime = new Date(startTime);
        endTime = new Date(endTime);
        if (startTime.getTime() > endTime.getTime()){
          msg.push('start '+type+' can\'t be greater than end time');
        } else if (startTime.getTime() === endTime.getTime()) {

        }
        if (msg.length) {
          errorMsg['start_'+type] = msg;
        } else {
          errorMsg['start_'+type] = [];
        }
      }
      return errorMsg;
    };

    self.inProgress = function (options) {
      options = options || {};
      var params = angular.merge({}, {
        load: 'in-progress'
      }, options);

      return self.all(params);
    };

    self.upcoming = function (options) {
      options = options || {};
      var params = angular.merge({},
        {
          load: 'upcoming'
        }, options);
      return self.all(params);
    };

    self.awaitingApproval = function (options) {
      options = options || {};
      var params = angular.merge({},
        {
          load: 'pending'
        }, options);
      return self.all(params);
    };

    self.rejected = function (options) {
      options = options || {};
      var params = angular.merge({},
        {
          load: 'rejected'
        }, options);
      return self.all(params);
    };

    self.status = {
      REJECTED: 0,
      UPCOMING: 1,
      PENDING: 2,
      EXPIRED: 3,
      IN_PROGRESS: 4
    };

    self.getStatus = function (item) {
      if (item.hasOwnProperty('status') && self.status.hasOwnProperty(item.status)) {
        return self.status[item.status];
      } else if (item.hasOwnProperty('status') && item.status === null) {
        var appointmentTime = new Date(item.start_date).getTime();
        var now = new Date().getTime();
        if (new Date(item.end_date).getTime() > now) {

        }
      }
    };

    this.cache = function () {
      cache.VIEW_KEY = TABLE;
      return cache;
    };

    this.setState = function (doc) {
      doc._id = CACHEDB;
      return pouchdb.save(doc);
    };

    this.getState = function () {
      return pouchdb.get(CACHEDB);
    };

    function outLookCalenderTemplate() {

      return 'BEGIN:VCALENDAR\n' +
        'VERSION:2.0\n'+
        'PRODID:-//vilogged.com v1.0//EN\n'+
        'BEGIN:VEVENT\n'+
        'DTSTAMP:&&startDate&&\n'+ //20140510T093846Z
        'ORGANIZER;CN=&&visitorsName&&:MAILTO:&&visitorsMail&&\n'+
        'STATUS:CONFIRMED\n'+
        'DTSTART:&&startDate&&\n'+//20140510T093846Z
        'DTEND:&&endDate&&\n'+ //20140511T093846Z
        'SUMMARY:&&appointSummary&&\n'+
        'DESCRIPTION:&&appointmentDesc&&\n'+
        'X-ALT-DESC;FMTTYPE=text/html:&&appointmentDesc&&\n'+
        'LOCATION:&&location&&\n'+
        'END:VEVENT\n'+
        'END:VCALENDAR';
    }

    self.getOutlookCalender = function(appointment, location) {

      var start = (appointment.start_date + ' '+ $filter('date')(appointment.start_time, 'HH:mm:ss')).split(/[\s|:|-]/);
      var end =  (appointment.start_date + ' '+ $filter('date')(appointment.end_time, 'HH:mm:ss')).split(/[\s|:|-]/);

      var startTime = (new Date(start[0], start[1]-1, start[2], start[3], start[4], start[5]).toJSON()).replace(/[-|:]/g, '').split('.')[0]+'Z';
      var endTime = (new Date(end[0], end[1]-1, end[2], end[3], end[4], end[5]).toJSON()).replace(/[-|:]/g, '').split('.')[0]+'Z';

      var params = {
        startDate: startTime,
        endDate: endTime,
        visitorsName: appointment.visitor.first_name,
        visitorsMail: appointment.visitor.email,
        appointSummary: '',
        appointmentDesc: '',
        location: location || ''
      };

      return utility.compileTemplate(params, outLookCalenderTemplate());
    };

    self.msgFields = function (type, appointment) {
      console.log(appointment)
      var fields = {
        approval: {
          last_name: appointment.visitor.last_name,
          first_name: appointment.visitor.first_name,
          host_last_name: appointment.host.last_name,
          host_first_name: appointment.host.first_name,
          date: $filter('date')(appointment.start_date, 'mediumDate'),
          start_time: $filter('date')(appointment.start_time, 'HH:mm')
        },
        created: {
          last_name: appointment.host.last_name,
          first_name: appointment.host.first_name
        }
      };

      return fields[type];
    };

    this.sms = function (appointment, type) {
      var fields = self.msgFields(type, appointment);
      var msg;
      var phone;
      if (type === 'approval') {
        msg = utility.compileTemplate(fields, messenger.messageTemplates.appointments.APPROVAL_SMS);
        phone = appointment.visitor.phone;
      } else if (type === 'created') {
        phone = appointment.host.phone;
        msg = utility.compileTemplate(fields, messenger.messageTemplates.appointments.CREATED_SMS);
      }

      return messenger.send.sms({
        to: phone,
        subject: 'Appointment Created.',
        message: msg
      });
    }

    this.email = function (appointment, type) {
      var fields = self.msgFields(type, appointment);
      var msg;
      var email;
      if (type === 'approval') {
        msg = utility.compileTemplate(fields, messenger.messageTemplates.appointments.APPROVAL_EMAIL);
        email = appointment.visitor.email;
      } else if (type === 'created') {
        email = appointment.host.email;
        msg = utility.compileTemplate(fields, messenger.messageTemplates.appointments.CREATED_EMAIL);
      }

      return messenger.send.sms({
        to: email,
        subject: 'Appointment Created.',
        message: msg
      });
    }
  });
