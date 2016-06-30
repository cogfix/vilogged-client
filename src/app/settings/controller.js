'use strict';

angular.module('settings')
  .controller('SettingsCtrl', function (
    settingService,
    formService,
    emailSettings,
    databaseSettings,
    ldapSettings,
    smsSettings,
    systemSettings,
    authService,
    $state,
    log
  ) {
    var user = authService.currentUser();
    if (!user.is_superuser && !user.is_staff) {
      log.error('unauthorizedAccess');
      $state.go('users.profile');
    }
    var vm = this;
    var COLUMN = 2;
    var types = {
      email: emailSettings,
      database: databaseSettings,
      sms: smsSettings,
      ldap: ldapSettings,
      system: systemSettings
    };
    vm.placeholder = formService.placeholder;
    vm.open = function (type) {
      vm.active = type || 'system';
      loadSettings();
    };

    function loadSettings () {
      var service = types[vm.active];
      var column = service.COLUMN || COLUMN;
        vm.templateName = service.templateName || 'system.html';
      vm.template = ['app/settings/partials', vm.templateName].join('/');
      vm.formHeader = service.formHeader;
      settingService.ID = service.ID;
      settingService.model = service.model;
      vm.errorMsg = {};
      vm.viewModel = {};
      vm.column = (12/column);
      vm.model = service.model;
      vm.form = formService.modelToForm(vm.model, COLUMN);
      settingService.get()
        .then(function (response) {
          vm.viewModel = response;
        })
        .catch(function (error) {

        })
    }

    vm.open();

    settingService.all()
      .then(function (response) {

      })
      .catch(function (reason) {

      })

    vm.save = function () {
      settingService.save(vm.viewModel)
        .then(function () {
          log.success('entrySaved');
        })
        .catch(function (error) {
          if (Object.prototype.toString.call(error) === '[object Object]' && error.hasOwnProperty('detail')) {
            log.error(error.detail);
          } else {
            log.error('unknownError');
          }
          console.log(error);
        })
    }
  });
