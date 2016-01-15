angular.module('visitors')
  .service('visitorService', function (dbService, validationService, authService) {
    var TABLE = 'visitor';
    var _this = this;

    _this.model = {
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
        serviceInstance: _this,
        label: 'Phone',
        formType: 'text',
        custom: true,
        template: 'app/visitors/form/partials/phone.html'
      }),
      email: validationService.EMAIL({
        required: false,
        unique: true,
        fieldName: 'email',
        serviceInstance: _this,
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
      group: validationService.BASIC({
        required: false,
        label: 'Visitor Group',
        formType: 'select',
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

    _this.get = function (id, option) {
      return dbService.get(TABLE, id, option);
    };

    _this.all = function (option) {
      return dbService.all(TABLE, option);
    };

    _this.remove = function (id, option) {
      return dbService.remove(TABLE, id, option);
    };

    _this.save = function (id, option) {
      return dbService.save(TABLE, id, option);
    };


    _this.validateField = function (params, fieldData, id) {
      return validationService.validateField(params, fieldData, id);
    };

    _this.validate = function (object) {
      return validationService.validateFields(_this.model, object, object._id)
        .then(function (response) {
          return eliminateEmpty(angular.merge({}, response));
        });
    };

    _this.getPassCode = function () {

    };

    _this.updateForPhone = function (response) {
      if (response.hasOwnProperty('phone.prefix') || response.hasOwnProperty('phone.suffix')) {
        response['phone'] = [];
      }

      return response;
    };

    _this.updateForPrefix = function (response, prefix) {
      if (response.hasOwnProperty('phone.prefix') && prefix === 'Others') {
        response['phone.prefix'] = [];
      }
      return response;
    };

    _this.getPhone = function (prefix, suffix) {
      var phoneList = [];
      if (!_this.isEmpty(prefix) && !_this.isEmpty(suffix)) {
        if (prefix !== 'Others') {
          phoneList.push(prefix);
        }
        phoneList.push(suffix);
      }
      return phoneList.join('');
    };

    _this.recoverPhone = function (phone) {
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

    _this.isEmpty = validationService.isEmpty;

    function eliminateEmpty (response) {
      var hash = {};
      for (var key in response) {
        if (response.hasOwnProperty(key) && response[key].length > 0) {
          hash[key] = response[key];
        }
      }
      return hash;
    }

  });