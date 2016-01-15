angular.module('departments')
  .service('departmentService', function (dbService, validationService, $q) {
    var TABLE = 'department';
    var _this = this;

    _this.model = {
      name: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        required: true,
        unique: true,
        fieldName: 'name',
        serviceInstance: _this,
        label: 'Department'
      }),
      floor: validationService.BASIC({
        required: false,
        label: 'Floor'
      })
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

    _this.get = function (id, option) {
      return dbService.get(TABLE, id, option);
    };

    _this.all = function (id, option) {
      return dbService.all(TABLE, id, option);
    };

    _this.remove = function (id, option) {
      return validateDelete(id)
        .then(function () {
          return dbService.remove(TABLE, id, option);
        });

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

    function validateDelete (id) {
      var deferred = $q.defer();
      dbService.all(dbService.tables.USER, {department: id })
        .then(function (response) {
          if (response.count > 0) {
            deferred.reject([
              'Department is still tied to some users',
              'Kindly reassign Users to another department'
            ].join('\n'));
          } else {
            deferred.resolve('');
          }
        })
        .catch(function (reason) {
          deferred.reject(reason);
        });

      return deferred.promise;
    }


  });