'use strict';

angular.module('settings')
  .controller('SettingsCtrl', function (settingService) {
    settingService.all()
      .then(function (response) {

      })
      .catch(function (reason) {

      })
  });