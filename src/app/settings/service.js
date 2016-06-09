'use strict';

angular.module('settings')
  .service('settingService', function (
    validationService,
    dbService
  ) {
    var self = this;
    var TABLE = 'settings';
    self.ID = null;

    this.model = {};

    self.get = function (option) {
      return dbService.get(TABLE, self.ID, option);
    };

    self.all = function (option) {
      return dbService.all(TABLE, option);
    };

    self.remove = function (option) {
      return dbService.remove(TABLE, self.ID, option);
    };

    self.save = function (doc, option) {
      doc._id = self.ID;
      return dbService.save(TABLE, doc, option);
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
  })
  .service('systemSettings', function (validationService) {
    var self = this;
    self.ID = 'system';
    self.COLUMN = 1;
    self.model = {
      dbSettingSource: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        fieldName: 'db_source',
        serviceInstance: self,
        label: 'Database Settings Source',
        formType: 'select',
        choices: [
          {value: 'environment', text: 'Environment Variables'},
          {value: 'system', text: 'System Form'}
        ]
      }),
      refreshRate: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Page Refresh Rate',
        fieldName: 'refreshRate',
        formType: 'number',
        placeholder: 'enter number in seconds'
      })
    };

    self.templateName = 'system.html';
    self.formHeader = 'System Settings';
  })
  .service('emailSettings', function (validationService) {
    var self = this;
    self.ID = 'email';
    self.model = {
      host: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        fieldName: 'host',
        serviceInstance: self,
        label: 'Host',
        formType: 'text'
      }),
      port: validationService.INT({
        fieldName: 'port',
        serviceInstance: self,
        label: 'Port',
        formType: 'number'
      }),
      username: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Username',
        fieldName: 'username',
        formType: 'text'
      }),
      password: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Password',
        fieldName: 'password',
        formType: 'password'
      }),
      fromName: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Email From Name',
        fieldName: 'fromName',
        formType: 'text'
      }),
      replyTo: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Reply To Email',
        fieldName: 'replyTo',
        formType: 'text'
      })
    };

    self.templateName = 'email.html';
    self.formHeader = 'Email Settings';
  })
  .service('databaseSettings', function (validationService) {
    var self = this;
    self.ID = 'database';
    self.model = {
      host: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        fieldName: 'host',
        serviceInstance: self,
        label: 'Host',
        formType: 'text'
      }),
      username: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Username',
        fieldName: 'username',
        formType: 'text'
      }),
      password: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Password',
        fieldName: 'password',
        formType: 'password'
      }),
      port: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Port',
        fieldName: 'port',
        formType: 'text'
      }),
      type: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Port',
        fieldName: 'port',
        formType: 'select',
        choices: [
          {value: 'mssql', text: 'SQL Server'},
          {value: 'postgres', text: 'PostgresSQL'},
          {value: 'sqlite', text: 'Sqlite'},
          {value: 'mysql', text: 'MySQL'}
        ]
      })

    };

    self.templateName = 'database.html';
    self.formHeader = 'Database Settings';
  })
  .service('smsSettings', function (validationService) {
    var self = this;
    self.ID = 'sms';
    self.model = {
      host: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        fieldName: 'host',
        serviceInstance: self,
        label: 'Host',
        formType: 'text'
      }),
      user: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Username',
        fieldName: 'username',
        formType: 'text'
      }),
      password: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Password',
        fieldName: 'password',
        formType: 'password'
      }),
      smsAPIURL: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'SMS API URL',
        fieldName: 'smsAPIURL',
        formType: 'text'
      })
    };

    self.templateName = 'sms.html';
    self.formHeader = 'SMS Settings';
  })
  .service('ldapSettings', function (validationService) {
    var self = this;
    self.ID = 'ldap';
    self.model = {
      host: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        fieldName: 'host',
        serviceInstance: self,
        label: 'Host',
        formType: 'text'
      }),
      user: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Username',
        fieldName: 'username',
        formType: 'text'
      }),
      password: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Password',
        fieldName: 'password',
        formType: 'password'
      }),
      port: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Port',
        fieldName: 'port',
        formType: 'text'
      }),
      baseDN: validationService.BASIC({
        pattern: '/^[a-zA-Z]/',
        label: 'Base Domain Name',
        fieldName: 'username',
        formType: 'text'
      })
    };

    self.templateName = 'ldap.html';
    self.formHeader = 'LDAP Settings';
  });
