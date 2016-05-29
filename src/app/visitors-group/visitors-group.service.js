angular.module('visitorsGroup')
  .service('visitorsGroupService', function (dbService, validationService, authService) {
    var TABLE = dbService.tables.VISITORS_GROUP;
    var self = this;
  
    self.model = {
      name: validationService.BASIC({
        required: true,
        unique: true,
        fieldName: 'name',
        serviceInstance: self,
        label: 'Group',
        formType: 'text'
      }),
      black_listed: validationService.BASIC({
        required: false,
        fieldName: 'black_listed',
        serviceInstance: self,
        label: 'Black Listed ?',
        formType: 'checkbox'
      })
    };
  
    self.get = function (option) {
      return dbService.get(TABLE, option);
    };
  
    self.all = function (id, option) {
      return dbService.all(TABLE, id, option);
    };
  
    self.remove = function (id, option) {
      return dbService.remove(TABLE, id, option);
    };
  
    self.save = function (id, option) {
      return dbService.save(TABLE, id, option);
    };
  
    self.validateField = function (fieldData, fieldName, id) {
      return validationService.validateField(self.model[fieldName], fieldData, id);
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
  
    self.validate = function (object) {
      return validationService.validateFields(self.model, object, object._id)
        .then(function (response) {
          return validationService.eliminateEmpty(angular.merge({}, response));
        });
    };

  });
