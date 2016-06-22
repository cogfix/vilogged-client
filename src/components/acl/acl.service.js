'use strict';

angular.module('acl')
  .service('aclService', function (dbService) {
    var self = this;
    var TABLE = 'permissions';

    var permissions = {
      staff: {
        users: {
          create: true,
          remove: false,
          update: true,
          read: true,
          export: false,
          tableSearch: true
        },
        visitors: {
          create: true,
          remove: false,
          update: true,
          read: true,
          export: false,
          tableSearch: true
        },
        appointments: {
          create: true,
          remove: false,
          update: true,
          read: true,
          export: true,
          tableSearch: true
        },
        settings: {
          create: false,
          remove: false,
          update: false,
          read: false
        }
      },
      members: {
        users: {
          create: false,
          remove: false,
          update: false,
          read: false,
          export: false,
          tableSearch: false
        },
        visitors: {
          create: true,
          remove: false,
          update: false,
          read: false,
          export: false,
          tableSearch: false
        },
        appointments: {
          create: true,
          remove: false,
          update: true,
          read: true,
          export: true,
          tableSearch: true
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
        return permissions.staff[module] || {};
      } else {
        return permissions.members[module] || {};
      }
    };

    self.get = function (id, option) {
      return dbService.get(TABLE, id, option);
    };
  });
