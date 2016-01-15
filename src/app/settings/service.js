'use strict';

angular.module('settings')
  .service('settingService', function (
    validationService,
    dbService
  ) {
    var TABLE = 'settings';
    var _this = this;

    this.model = {
      name: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        required: true,
        unique: true,
        fieldName: 'name',
        serviceInstance: _this,
        label: 'Company Name',
        formType: 'text'
      }),
      address: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Address',
        fieldName: 'address',
        formType: 'text'
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

    _this.validateField = function (fieldData, fieldName) {
      return validationService.validateField(_this.model[fieldName], fieldData);
    };

    _this.validate = function (object) {
      return validationService.validateFields(_this.model, object, object._id)
        .then(function (response) {
          return validationService.eliminateEmpty(angular.merge({}, response));
        });
    };
  });