'use strict';

/**
 * @ngdoc service
 * @name validationService
 * @description
 * # validationService.
 */
angular.module('validation')
  .service('validationService', function validationService($q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;
    var emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var usernamePattern = /^[A-Za-z0-9_]{3,20}$/;
  
    self.BASIC = function (options) {
      options = options || {};
      var params = {
        required: true,
        pattern: '',
        checkLength: false,
        minLength: 0,
        maxLength: 0,
        unique: false,
        dbName: '',
        type: 'basic'
      };

      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          params[key] = options[key];
        }
      }

      return params;
    };
  
    self.INT = function (options) {
      var params = {
        required: false,
        pattern: '/^[0-9]/',
        checkLength: false,
        minLength: 0,
        maxLength: 0,
        unique: false,
        dbName: '',
        type: 'int'
      };

      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          params[key] = options[key];
        }
      }

      return params;
    };
  
    self.EMAIL = function (options) {
      var params = {
        required: false,
        pattern: emailPattern,
        checkLength: false,
        unique: false,
        dbName: '',
        fieldName: '',
        dataList: [],
        type: 'email'
      };

      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          params[key] = options[key];
        }
      }
      return params;
    };
  
    self.USERNAME = function (options) {

      var params = {
        required: false,
        pattern: usernamePattern,
        checkLength: true,
        minLength: 3,
        maxLength: 20,
        unique: true,
        type: 'username'
      };

      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          params[key] = options[key];
        }
      }
      return params;
    };
  
    self.validateRequired = function (fieldData, _params) {
      var params = _params || self.BASIC();
      return (fieldData === '' || fieldData === undefined) && params.required ? ['This field is required'] : [];
    };
  
    self.validateStringLength = function (fieldData, _params) {
      var params = _params || self.BASIC();
      var messages = [];
      if (params.checkLength && params.minLength > fieldData.length) {
        messages.push('character length is less than ' + params.minLength);
      }
      
      if (params.checkLength && params.maxLength !== 0 && fieldData.length > params.maxLength) {
        messages.push('you have exceeded the maximum characters allowed (' + params.maxLength + ')');
      }
      return messages;
    };
  
    self.validateInt = function (fieldData, _params) {
      var params = _params || self.BASIC();
      var messages = [];
      if (params.pattern !== '' && params.pattern.test(fieldData)) {
        messages.push('Only integers are allowed.');
      }
      return messages;
    };
  
    self.validateEmail = function (fieldData, _params) {
      var params = _params || self.EMAIL();
      var messages = [];
      if (!self.isEmpty(fieldData) && !params.pattern.test(fieldData)) {
        messages.push('invalid email provided');
      }

      return messages;
    };
  
    self.validateUnique = function (fieldData, _params, id) {
      var deferred = $q.defer();
      _params = _params || {};
      if (_params.unique && _params.hasOwnProperty('serviceInstance') && !self.isEmpty(fieldData)) {
        var params = {};
        params[_params.fieldName] = fieldData;
        if (!self.isEmpty(id)) {
          params['_id-ne'] = id;
        }
        return _params.serviceInstance.all(params)
          .then(function (response) {
            if (response.count > 0) {
              return [[_params.fieldName,'already exists, kindly provide another'].join(' ')];
            }
            return [];
          });
      }
      deferred.resolve([]);
      return deferred.promise;
    };
  
    self.validateFields = function (params, formModelObject, id) {
      var errors = {};
      if (angular.isObject(params) && (Object.keys(params)).length > 0) {
        (Object.keys(params)).forEach(function(key) {
          errors[key] = self.validateField(params[key], formModelObject[key], id);
        });
      }
      return $q.all(errors);
    };
  
    self.validateField = function (params, fieldData, id) {

      var messages = [];
      var required = self.validateRequired(fieldData, params);
      var lengthValidation = angular.isDefined(fieldData) ? self.validateStringLength(fieldData, params) : [];
      var emailValidation = params.type === 'email' && angular.isDefined(fieldData) ? self.validateEmail(fieldData, params) : [];
      //var usernameValidation = params.type === 'username' && angular.isDefined(fieldData) ? self.validateUsername(fieldData, params) : [];
      var intValidation = params.type === 'int' && angular.isDefined(fieldData) ? self.validateInt(fieldData, params) : [];
      var updatedMessages = messages.concat(required, lengthValidation, emailValidation, intValidation);
    
      return self.validateUnique(fieldData, params, id)
        .then(function (response) {
          return updatedMessages.concat(response);
        });
    };
  
    self.isEmpty = function (data) {
      return data === undefined || data === '' || data === null;
    };
  
    self.eliminateEmpty = function (response) {
      var hash = {};
      for (var key in response) {
        if (response.hasOwnProperty(key) && response[key].length > 0) {
          hash[key] = response[key];
        }
      }
      return hash;
    };
  
    self.mergeErrorMsg = function (dest, src) {
      for (var key in src) {
        if (src.hasOwnProperty(key) && dest.hasOwnProperty(key)) {
          dest[key] = dest[key].concat(src[key]);
        } else if (src.hasOwnProperty(key)) {
          dest[key] = src[key];
        }
      }
      return dest;
    };

  });
