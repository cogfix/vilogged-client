'use strict';

angular.module('company')
  .service('companyService', function ($q, dbService, validationService) {
    var TABLE = 'company';
    var self = this;
  
    self.model = {
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
  
    self.choices = function () {
      return self.all()
        .then(function (response) {
          var choices = [];
          var i = response.count;
          while (i--) {
            var row = response.results[i];
            choices.push({
              value: row._id,
              text: row.name
            });
          }
          return choices;
        });
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
