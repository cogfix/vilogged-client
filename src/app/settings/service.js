'use strict';

angular.module('settings')
  .service('settingService', function (
    validationService,
    dbService
  ) {
    var TABLE = 'settings';
    var self = this;

    this.model = {
      name: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        required: true,
        unique: true,
        fieldName: 'name',
        serviceInstance: self,
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
  
    self.validateField = function (fieldData, fieldName) {
      return validationService.validateField(self.model[fieldName], fieldData);
    };
  
    self.validate = function (object) {
      return validationService.validateFields(self.model, object, object._id)
        .then(function (response) {
          return validationService.eliminateEmpty(angular.merge({}, response));
        });
    };
  });
