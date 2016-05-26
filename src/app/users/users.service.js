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
    var _this = this;

    _this.model = {
      username: validationService.USERNAME({
        required: true,
        unique: true,
        fieldName: 'username',
        serviceInstance: _this,
        label: 'Username',
        formType: 'text'
      }),
      email: validationService.EMAIL({
        required: true,
        unique: true,
        fieldName: 'email',
        serviceInstance: _this,
        label: 'Email',
        formType: 'text'
      }),
      password:  validationService.BASIC({
        required: true,
        fieldName: 'password',
        serviceInstance: _this,
        label: 'Password',
        formType: 'text'
      }),
      password2:  validationService.BASIC({
        required: true,
        fieldName: 'password2',
        serviceInstance: _this,
        label: 'Confirm Password',
        formType: 'text'
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
        serviceInstance: _this,
        label: 'Phone',
        formType: 'text'
      }),
      work_phone: validationService.BASIC({
        required: false,
        unique: true,
        fieldName: 'work_phone',
        serviceInstance: _this,
        label: 'Work Phone',
        formType: 'text'
      }),
      home_phone: validationService.BASIC({
        required: false,
        unique: true,
        fieldName: 'home_phone',
        serviceInstance: _this,
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

    _this.get = function (id, option) {
      return dbService.get(TABLE, id, option);
    };

    _this.all = function (option) {
      return dbService.all(TABLE, option);
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

    _this.currentUser = function () {
      return authService.currentUser();
    };

    _this.updateCurrentUser = function (user) {
      return authService.updateCurrentUser(user);
    };

    _this.validateField = function (fieldData, fieldName, id) {
      return validationService.validateField(_this.model[fieldName], fieldData, id);
    };

    _this.validate = function (object) {
      var passw = {};

      if (object.hasOwnProperty('password')) {
        if (object.password === '') {
          passw.password = ['This field is required'];
        } else if (object.password !== object.password2 ) {
          passw.password = ['Passwords does not match'];
          passw.password2 = ['Passwords does not match'];
        }
      }
      return validationService.validateFields(_this.model, object, object._id)
        .then(function (response) {
          return validationService.eliminateEmpty(angular.merge({}, response, passw));
        });
    };

    _this.validatePassword = function (password, password2, type) {
      var passVal = {};
      if (password === '' || password === undefined && type === 'password') {
        passVal.password = ['This field is required'];
      } else if (angular.isDefined(password) && (password2 === '' || password2 === undefined && type === 'password2')) {
        passVal.password2 = ['Kindly confirm password'];
      } else if (angular.isDefined(password) && (password2 !== '' && password2 === undefined && type === 'password2') && password !== password2) {
        passVal.password = ['Passwords does not match'];
        passVal.password2 = ['Passwords does not match'];
      }

      return passVal;
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
