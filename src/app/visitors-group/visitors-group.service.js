angular.module('visitorsGroup')
  .service('visitorsGroupService', function (dbService, validationService, authService) {
    var TABLE = dbService.tables.VISITORS_GROUP;
    var _this = this;

    _this.model = {
      name: validationService.BASIC({
        required: true,
        unique: true,
        fieldName: 'name',
        serviceInstance: _this,
        label: 'Group',
        formType: 'text'
      }),
      black_listed: validationService.BASIC({
        required: false,
        fieldName: 'black_listed',
        serviceInstance: _this,
        label: 'Black Listed ?',
        formType: 'checkbox'
      })
    };

    _this.get = function (option) {
      return dbService.get(TABLE, option);
    };

    _this.all = function (id, option) {
      return dbService.all(TABLE, id, option);
    };

    _this.remove = function (id, option) {
      return dbService.remove(TABLE, id, option);
    };

    _this.save = function (id, option) {
      return dbService.save(TABLE, id, option);
    };

    _this.validateField = function (fieldData, fieldName, id) {
      return validationService.validateField(_this.model[fieldName], fieldData, id);
    };

    _this.choices = function  () {
      return _this.all()
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

    _this.validate = function (object) {
      return validationService.validateFields(_this.model, object, object._id)
        .then(function (response) {
          return validationService.eliminateEmpty(angular.merge({}, response));
        });
    };

  });