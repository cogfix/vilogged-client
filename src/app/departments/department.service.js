angular.module('departments')
  .service('departmentService', function (dbService, validationService, $q) {
    var TABLE = 'department';
    var self = this;
  
    self.model = {
      name: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        required: true,
        unique: true,
        fieldName: 'name',
        serviceInstance: self,
        label: 'Department'
      }),
      floor: validationService.BASIC({
        required: false,
        label: 'Floor'
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
  
    self.all = function (id, option) {
      return dbService.all(TABLE, id, option);
    };
  
    self.remove = function (id, option) {
      return validateDelete(id)
        .then(function () {
          return dbService.remove(TABLE, id, option);
        });

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
