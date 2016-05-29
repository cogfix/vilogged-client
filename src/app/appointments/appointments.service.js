angular.module('appointments')
  .service('appointmentService', function (
    dbService,
    validationService,
    cache,
    pouchdb,
    $filter
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
      teams:  validationService.BASIC({
        required: false,
        label: 'Team Members',
        formType: 'multi-select',
        fieldName: 'teams'
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
  });
