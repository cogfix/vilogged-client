'use strict';
angular.module('config', [])
  .constant('config',
    {
      "name":"vi-logged",
      "version":"1.0.0",
      "author":"Musa Musa",
      "dateFormat":"yyyy-MM-dd",
      "mailerAPI":"https://mandrillapp.com/api/1.0/messages/send.json",
      "apiKey":"apiKey",
      "senderEmail":"no-reply@test.org",
      "senderName":"ViLogged VMS",
      "driver":"api",
      "api":
        {
          "url":"",
          "port":"7010",
          "path":"/api/v1",
          "auth":""
        },
      refreshIntervals: 300000000 //seconds
    });

