angular.module('appointments')
  .service('appointmentService', function (
    dbService,
    validationService,
    cache
  ) {
    var TABLE = dbService.tables.APPOINTMENT;
    var _this = this;

    _this.model = {
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
        serviceInstance: _this,
        label: 'Appointment End Time',
        formType: 'time'
      }),
      representing: validationService.BASIC({
        required: false,
        fieldName: 'representing',
        serviceInstance: _this,
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

    _this.get = function (id, option) {
      return dbService.get(TABLE, id, option);
    };

    _this.all = function (option) {
      return dbService.all(TABLE, option);
    };

    _this.remove = function (id, option) {
      return dbService.remove(TABLE, id, option);
    };

    _this.save = function (id, option) {
      return dbService.save(TABLE, id, option);
    };

    _this.getLog = function (id, option) {
      return dbService.get(dbService.tables.APPOINTMENT_LOGS, id, option);
    };

    _this.allLogs = function (options) {
      return dbService.all(dbService.tables.APPOINTMENT_LOGS, options);
    };

    _this.saveLog = function (id, options) {
      return dbService.save(dbService.tables.APPOINTMENT_LOGS, id, options);
    };

    _this.validateField = function (fieldData, fieldName, id) {
      return validationService.validateField(_this.model[fieldName], fieldData, id);
    };

    _this.validate = function (object) {
      return validationService.validateFields(_this.model, object, object._id)
        .then(function (response) {
          return validationService.eliminateEmpty(angular.merge({}, response));
        });
    };

    _this.dateTimeValidation = function (startTime, endTime, type) {
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

    _this.inProgress = function (options) {
      options = options || {};
      var params = angular.merge({}, {
        load: 'in-progress'
      }, options);

      return _this.all(params);
    };

    _this.upcoming = function (options) {
      options = options || {};
      var params = angular.merge({},
        {
          load: 'upcoming'
        }, options);
      return _this.all(params);
    };

    _this.awaitingApproval = function (options) {
      options = options || {};
      var params = angular.merge({},
        {
          load: 'pending'
        }, options);
      return _this.all(params);
    };

    _this.rejected = function (options) {
      options = options || {};
      var params = angular.merge({},
        {
          load: 'rejected'
        }, options);
      return _this.all(params);
    };

    _this.status = {
      REJECTED: 0,
      UPCOMING: 1,
      PENDING: 2,
      EXPIRED: 3,
      IN_PROGRESS: 4
    };

    this.cache = function () {
      cache.VIEW_KEY = TABLE;
      return cache;
    };
  });