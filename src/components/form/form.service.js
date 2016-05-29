'use strict';

angular.module('form')
  .service('formService', function (utility) {
    var self = this;
  
    self.chunk = function (array, size) {
      size = size || 2;
      return utility.chunk(array, size);
    };
  
    self.modelToForm = function (model, column, options) {
      options = options || {};
      var forms = [];
      for (var key in model) {
        if (model.hasOwnProperty(key) && !model[key].hasOwnProperty('hidden')) {
          var modelOptions = options[key] || {};
          model[key].fieldName = model[key].fieldName || key;
          model[key].options = model[key].options || {};
          model[key].options = angular.merge({}, model[key].options, modelOptions);
          forms.push(model[key]);
        }
      }
      return self.chunk(forms, column);
    };
  
    self.placeholder = function (label, placeholder) {
      var defaultHolder = ['Enter', label, 'Here'].join(' ');
      return placeholder || defaultHolder;
    };
  
    self.isEmpty = function (data) {
      return data === undefined || data === '' || data === null;
    };
  
    self.phonePrefixes = function () {
      return [
        "0701",
        "0703",
        "0705",
        "0706",
        "0708",
        "0802",
        "0803",
        "0804",
        "0805",
        "0806",
        "0807",
        "0808",
        "0809",
        "0810",
        "0811",
        "0812",
        "0813",
        "0814",
        "0815",
        "0816",
        "0817",
        "0818",
        "0819",
        "0909",
        "0902",
        "0903",
        "0905",
        "Others"
      ]
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
