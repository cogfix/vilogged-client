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
    var _this = this;
    var emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var usernamePattern = /^[A-Za-z0-9_]{3,20}$/;
    
    _this.BASIC = function(options) {
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
    
    _this.INT = function(options){
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
    
    _this.EMAIL = function(options) {
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
    
    _this.USERNAME = function(options) {

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
    
    _this.validateRequired = function (fieldData, _params) {
      var params = _params || _this.BASIC();
      return (fieldData === '' || fieldData === undefined) && params.required ? ['This field is required'] : [];
    };
    
    _this.validateStringLength = function (fieldData, _params) {
      var params = _params || _this.BASIC();
      var messages = [];
      if (params.checkLength && params.minLength > fieldData.length) {
        messages.push('character length is less than ' + params.minLength);
      }
      
      if (params.checkLength && params.maxLength !== 0 && fieldData.length > params.maxLength) {
        messages.push('you have exceeded the maximum characters allowed (' + params.maxLength + ')');
      }
      return messages;
    };
    
    _this. validateInt = function (fieldData, _params) {
      var params = _params || _this.BASIC();
      var messages = [];
      if (params.pattern !== '' && params.pattern.test(fieldData)) {
        messages.push('Only integers are allowed.');
      }
      return messages;
    };
    
    _this.validateEmail = function (fieldData, _params) {
      var params = _params || _this.EMAIL();
      var messages = [];
      if (!_this.isEmpty(fieldData) && !params.pattern.test(fieldData)) {
        messages.push('invalid email provided');
      }

      return messages;
    };

    _this.validateUnique = function (fieldData, _params, id) {
      var deferred = $q.defer();
      _params = _params || {};
      if (_params.unique && _params.hasOwnProperty('serviceInstance') && !_this.isEmpty(fieldData)) {
        var params = {};
        params[_params.fieldName] = fieldData;
        if (!_this.isEmpty(id)) {
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
    
    _this.validateFields = function (params, formModelObject, id) {
      var errors = {};
      if (angular.isObject(params) && (Object.keys(params)).length > 0) {
        (Object.keys(params)).forEach(function(key) {
          errors[key] = _this.validateField(params[key], formModelObject[key], id);
        });
      }
      return $q.all(errors);
    };

    _this.validateField = function (params, fieldData, id) {

      var messages = [];
      var required = _this.validateRequired(fieldData, params);
      var lengthValidation = angular.isDefined(fieldData) ? _this.validateStringLength(fieldData, params) : [];
      var emailValidation = params.type === 'email' && angular.isDefined(fieldData) ? _this.validateEmail(fieldData, params) : [];
      //var usernameValidation = params.type === 'username' && angular.isDefined(fieldData) ? _this.validateUsername(fieldData, params) : [];
      var intValidation = params.type === 'int' && angular.isDefined(fieldData) ? _this.validateInt(fieldData, params) : [];
      var updatedMessages = messages.concat(required, lengthValidation, emailValidation, intValidation);

      return _this.validateUnique(fieldData, params, id)
        .then(function (response) {
          return updatedMessages.concat(response);
        });
    };

    _this.isEmpty = function (data) {
      return data === undefined || data === '' || data === null;
    };

    _this.eliminateEmpty = function (response) {
      var hash = {};
      for (var key in response) {
        if (response.hasOwnProperty(key) && response[key].length > 0) {
          hash[key] = response[key];
        }
      }
      return hash;
    };

    _this.mergeErrorMsg = function (dest, src) {
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