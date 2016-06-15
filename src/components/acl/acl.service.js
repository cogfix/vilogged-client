'use strict';

angular.module('acl')
  .service('aclService', function () {
    var self = this;

    var permissions = {
      staff: {
        users: {
          create: true,
          remove: false,
          update: true,
          read: true
        },
        visitors: {
          create: true,
          remove: false,
          update: true,
          read: true
        },
        appointments: {
          create: true,
          remove: false,
          update: true,
          read: true
        },
        settings: {
          create: false,
          remove: false,
          update: false,
          read: false
        }
      }
    };

    self.hasPermission = function (user, module) {
      if (user.is_superuser) {
        return true;
      } else if (!user.is_superuser && user.is_staff) {
        
      }
    };
  });
