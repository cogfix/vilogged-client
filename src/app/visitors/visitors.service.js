angular.module('visitors')
  .service('visitorService', function (dbService, validationService, authService) {
    var TABLE = 'visitor';
    var self = this;
  
    self.model = {
      first_name: validationService.BASIC({
        required: true,
        fieldName: 'first_name',
        pattern: /^[a-zA-Z]/,
        label: 'First Name',
        formType: 'text'
      }),
      last_name: validationService.BASIC({
        required: true,
        fieldName: 'last_name',
        pattern: /^[a-zA-Z]/,
        label: 'Last Name',
        formType: 'text'
      }),
      phone: validationService.BASIC({
        required: true,
        unique: true,
        fieldName: 'phone',
        serviceInstance: self,
        label: 'Phone',
        formType: 'text',
        custom: true,
        template: 'app/visitors/form/partials/phone.html'
      }),
      email: validationService.EMAIL({
        required: false,
        unique: true,
        fieldName: 'email',
        serviceInstance: self,
        label: 'Email',
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
      'company.name':  validationService.BASIC({
        required: false,
        label: 'Company Name',
        fieldName: 'company.address',
        formType: 'typeahead',
        custom: true,
        template: 'app/visitors/form/partials/company.html'
      }),
      'company.address':  validationService.BASIC({
        required: false,
        label: 'Company Address',
        formType: 'textarea',
        fieldName: 'company.address'
      }),
      occupation:  validationService.BASIC({
        required: false,
        label: 'Occupation',
        formType: 'text',
        fieldName: 'occupation'
      }),
      black_listed: validationService.BASIC({
        required: false,
        label: 'Black Listed?',
        formType: 'checkbox',
        fieldName: 'group'
      }),
      'phone.prefix':  validationService.BASIC({
        required: true,
        pattern: /^[0-9]/,
        label: 'Phone Prefix',
        formType: 'text',
        fieldName: 'phone.prefix',
        hidden: true
      }),
      'phone.suffix':  validationService.BASIC({
        required: true,
        checkLength: true,
        maxLength: 7,
        minLength: 7,
        pattern: /^[0-9]/,
        label: 'Phone Suffix',
        formType: 'text',
        fieldName: 'phone.suffix',
        hidden: true
      })
    };
  
    self.get = function (id, option) {
      return dbService.get(TABLE, id, option);
    };
  
    self.all = function (option) {
      return dbService.all(TABLE, option);
    };
  
    self.remove = function (id, option) {
      return dbService.remove(TABLE, id, option);
    };
  
    self.save = function (id, option) {
      return dbService.save(TABLE, id, option);
    };
  
  
    self.validateField = function (params, fieldData, id) {
      return validationService.validateField(params, fieldData, id);
    };
  
    self.validate = function (object) {
      return validationService.validateFields(self.model, object, object._id)
        .then(function (response) {
          return eliminateEmpty(angular.merge({}, response));
        });
    };
  
    self.getPassCode = function () {

    };
  
    self.updateForPhone = function (response) {
      if (response.hasOwnProperty('phone.prefix') || response.hasOwnProperty('phone.suffix')) {
        response['phone'] = [];
      }

      return response;
    };
  
    self.updateForPrefix = function (response, prefix) {
      if (response.hasOwnProperty('phone.prefix') && prefix === 'Others') {
        response['phone.prefix'] = [];
      }
      return response;
    };
  
    self.getPhone = function (prefix, suffix) {
      var phoneList = [];
      if (!self.isEmpty(prefix) && !self.isEmpty(suffix)) {
        if (prefix !== 'Others') {
          phoneList.push(prefix);
        }
        phoneList.push(suffix);
      }
      return phoneList.join('');
    };
  
    self.recoverPhone = function (phone) {
      var rePhone = {};
      if (phone.length > 7) {
        rePhone['phone.prefix'] = phone.slice(0, 4);
        rePhone['phone.suffix'] = phone.slice(4, phone.length);
      } else if (phone.length <= 7 ) {
        rePhone['phone.prefix'] = 'Others';
        rePhone['phone.suffix'] = phone;
      }
      return rePhone;
    };
  
    self.isEmpty = validationService.isEmpty;

    function eliminateEmpty (response) {
      var hash = {};
      for (var key in response) {
        if (response.hasOwnProperty(key) && response[key].length > 0) {
          hash[key] = response[key];
        }
      }
      return hash;
    }
  
    this.setState = function (doc) {
      doc._id = CACHEDB;
      return pouchdb.save(doc);
    };
  
    this.getState = function () {
      return pouchdb.get(CACHEDB);
    };

  });
