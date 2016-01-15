'use strict';

angular.module('log')
  .service('log', function ($log, toastr, ERROR_MESSAGES, WARNING_MESSAGES, INFO_MESSAGES, SUCCESS_MESSAGES, $cookies) {
    var _this = this;
    function log(key, type, collection, customMessage) {

      if (!angular.isObject(type)) {
        type = {
          log: type,
          toastr: type
        };
      }

      var message = collection[key] || {
        message: ''
      };

      var text = [
        message.message
      ];
      if (customMessage) {
        text.push(customMessage);
      }
      if (type.log === 'error' || type.log === 'warn') {
        text.push(message.remedy);
      }
      text = text.join('. ') + '.';

      //$log[type.log](text, message, context);
      return toastr[type.toastr](text, message.title);
    }

    function persistentMsg (key, message, type) {
      var stored = $cookies.getObject('vi-persistent') || [];
      stored.push({
        key: key,
        message: message,
        type: type
      });
      $cookies.putObject('vi-persistent', stored);
    }

    function loadPersistent () {
      var stored = $cookies.getObject('vi-persistent') || [];
      var i = stored.length;
      while (i--) {
        var value = stored[i];
        if (_this.hasOwnProperty(value.type)) {
          _this[value.type](value.key, value.type, value.message);
        }
      }
      $cookies.remove('vi-persistent');
    }

    _this.error = function (key, message) {
      if (arguments.length === 1 && angular.isDefined(arguments[0]) && !ERROR_MESSAGES.hasOwnProperty(key)) {
        return toastr.error(arguments[0], 'Error');
      }
      return log(key, 'error', ERROR_MESSAGES, message);
    };

    _this.warning = function (key, message) {
      var methods = {
        log: 'warn',
        toastr: 'warning'
      };
      return log(key, methods, WARNING_MESSAGES, message);
    };

    _this.info = function (key, message) {
      return log(key, 'info', INFO_MESSAGES, message);
    };

    _this.success = function (key, message) {
      var methods = {
        log: 'log',
        toastr: 'success'
      };
      return log(key, methods, SUCCESS_MESSAGES, message);
    };
    
    _this.persist = {
      error: function (key, message) {
        return persistentMsg(key, message, 'error');
      },
      warn: function (key, message) {
        return persistentMsg(key, message, 'warn');
      },
      success: function (key, message) {
        return persistentMsg(key, message, 'success');
      },
      info: function (key, message) {
        return persistentMsg(key, message, 'info');
      },
      load: loadPersistent
    }

  });
