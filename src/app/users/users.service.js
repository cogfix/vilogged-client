angular.module('users')
  .service('userService', function (
    dbService,
    validationService,
    authService,
    $q,
    cache,
    pouchdb
  ) {
    var TABLE = 'user';
    var CACHEDB = [TABLE, '_cache'].join('');
    var self = this;
  
    self.model = {
      username: validationService.USERNAME({
        required: true,
        unique: true,
        fieldName: 'username',
        serviceInstance: self,
        label: 'Username',
        formType: 'text'
      }),
      email: validationService.EMAIL({
        required: true,
        unique: true,
        fieldName: 'email',
        serviceInstance: self,
        label: 'Email',
        formType: 'text'
      }),
      password:  validationService.BASIC({
        required: true,
        fieldName: 'password',
        serviceInstance: self,
        label: 'Password',
        formType: 'password'
      }),
      password2:  validationService.BASIC({
        required: true,
        fieldName: 'password2',
        serviceInstance: self,
        label: 'Confirm Password',
        formType: 'password'
      }),
      first_name: validationService.BASIC({
        required: true,
        fieldName: 'first_name',
        pattern: '/^[a-zA-Z]/',
        label: 'First Name',
        formType: 'text'
      }),
      last_name: validationService.BASIC({
        required: true,
        fieldName: 'last_name',
        pattern: '/^[a-zA-Z]/',
        label: 'Last Name',
        formType: 'text'
      }),
      phone: validationService.BASIC({
        required: true,
        unique: true,
        fieldName: 'phone',
        serviceInstance: self,
        label: 'Phone',
        formType: 'text'
      }),
      work_phone: validationService.BASIC({
        required: false,
        unique: true,
        fieldName: 'work_phone',
        serviceInstance: self,
        label: 'Work Phone',
        formType: 'text'
      }),
      home_phone: validationService.BASIC({
        required: false,
        unique: true,
        fieldName: 'home_phone',
        serviceInstance: self,
        label: 'Home Phone',
        formType: 'text'
      }),
      gender: validationService.BASIC({
        required: false,
        label: 'Gender',
        fieldName: 'gender',
        formType: 'select',
        choices: [
          {
            value: 'Male',
            text: 'Male'
          },
          {
            value: 'Female',
            text: 'Female'
          }
        ]
      }),
      department:  validationService.BASIC({
        required: false,
        label: 'Department',
        fieldName: 'department',
        formType: 'select',
        choices: []
      }),
      is_superuser:  validationService.BASIC({
        required: false,
        label: 'Super User',
        formType: 'checkbox',
        fieldName: 'is_superuser'
      }),
      is_staff:  validationService.BASIC({
        required: false,
        label: 'Admin Access',
        formType: 'checkbox',
        fieldName: 'is_staff'
      }),
      is_active:  validationService.BASIC({
        required: false,
        label: 'User Active',
        formType: 'checkbox',
        fieldName: 'is_active'
      })
    };
  
    self.get = function (id, option) {
      return dbService.get(TABLE, id, option);
    };
  
    self.all = function (option) {
      return dbService.all(TABLE, option);
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
  
    self.currentUser = function () {
      return authService.currentUser();
    };
  
    self.updateCurrentUser = function (user) {
      return authService.updateCurrentUser(user);
    };
  
    self.validateField = function (fieldData, fieldName, id) {
      return validationService.validateField(self.model[fieldName], fieldData, id);
    };
  
    self.validate = function (object) {
      var passw = {};
      console.log('here')
      if (object.hasOwnProperty('password')) {
        if (object.password === '') {
          passw.password = ['This field is required'];
        } else if (object.password !== object.password2 ) {
          passw.password = ['Passwords does not match'];
          passw.password2 = ['Passwords does not match'];
        }
      }
      return validationService.validateFields(self.model, object, object._id)
        .then(function (response) {
          return validationService.eliminateEmpty(angular.merge({}, response, passw));
        });
    };
  
    self.validatePasswordMatch = function (password, password2) {
      var deferred = $q.defer();
      var passVal = {};
    
      if ((!validationService.isEmpty(password) && !validationService.isEmpty(password2)) && password !== password2) {
        passVal.password = ['Passwords does not match'];
        passVal.password2 = ['Passwords does not match'];
      }
    
      deferred.resolve(passVal);
      return deferred.promise;
    };

    function validateDelete (id) {
      var deferred = $q.defer();
      var promises = [
        dbService.all(dbService.tables.APPOINTMENT, {host: id})
      ];

      $q.all(promises)
        .then(function (response) {
          var msg = [];
          if (response[0].count > 0) {
            msg.push('User has been tied to appointments before, kindly delete the appointment');
          }
          if (msg.length === 0) {
            deferred.resolve([]);
          } else {
            deferred.reject(msg.join('\n'));
          }
        })
        .catch(function (reason) {
          deferred.reject(reason);
        });
      return deferred.promise;
    }

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
