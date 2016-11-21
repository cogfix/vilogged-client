'use strict';

angular.module('dialog', [
  'dialogs.main'
]).config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
      DIALOGS_YES: 'Yes',
      DIALOGS_NO: 'No'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('sanitize');
  }]);
