'use strict';

angular.module('utility')
  .service('messenger', function ($http, dbService) {
    var self = this;
    var TABLE = 'messenger';

    self.sendMessage = function (messageObject) {
      // return dbService.db.post(TABLE, messageObject);
      $http.post(location.protocol + '//' + location.hostname + ':81/send-email', messageObject);
    };

    self.send = {
      sms: function(dataObject) {
        dataObject.type = 'sms';
        return (dataObject);
      },
      email: function(dataObject) {
        dataObject.type = 'email';
        self.sendMessage(dataObject);
      }
    };

    var APPOINTMENT_APPROVAL_EMAIL_TEMPLATE = 'Hello &&first_name&& &&last_name&&,\n\nYour appointment with &&host_first_name&& &&host_last_name&& has been approved.'
      + '\n\nYour appointment is scheduled for\n\nDate:&&date&& \nExpected Check in Time: &&start_time&&' +
      '\n\n&&organization&&';

    var APPOINTMENT_APPROVAL_SMS_TEMPLATE = 'Hello &&first_name&& &&last_name&&, your appointment with &&host_first_name&& &&host_last_name&& has been approved.'
      + ' Your appointment is scheduled for Date:&&date&& Expected Check in Time: &&start_time&&';

    var APPOINTMENT_CREATED_EMAIL_TEMPLATE = 'Hello &&first_name&& &&last_name&&,\n\nAn appointment, has been created for you, by NCC Frontdesk.\n\nVisitor\'s Name: &&visitor_first_name&& &&visitor_last_name&&\nContact Phone: &&visitor_phone&&\n\n'+
      'NCC Visitor\'s Managment System';

    var APPOINTMENT_CREATED_SMS_TEMPLATE = 'Hello &&first_name&& &&last_name&&, you have an appointment awaiting your approval.';

    self.messageTemplates = {
      appointments: {
        APPROVAL_EMAIL: APPOINTMENT_APPROVAL_EMAIL_TEMPLATE,
        APPROVAL_SMS: APPOINTMENT_APPROVAL_SMS_TEMPLATE,
        CREATED_EMAIL: APPOINTMENT_CREATED_EMAIL_TEMPLATE,
        CREATED_SMS: APPOINTMENT_CREATED_SMS_TEMPLATE
      }
    }

  });
