'use strict';

angular.module('acl')
  .service('aclService', function (dbService, $q) {
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

    function getUserPermissions (user, module) {
      if (user.is_superuser) {
        return {
          create: true,
          remove: true,
          update: true,
          read: true,
          export: true,
          tableSearch: true
        };
      } else if (!user.is_superuser && user.is_staff) {
        return permissions.staff[module] || {};
      } else {
        return permissions.members[module] || {};
      }
    }

    self.getPermissions = function (user, module) {
      if (user) {
        return $q.when(getUserPermissions(user, module));
      } else {
        return localforage.getItem('vi-user')
          .then(function (user) {
            user = user || {};
            return getUserPermissions(user, module);
          })
          .catch(function () {
            return {}
          });
      }
    };

    self.get = function (id, option) {
      return dbService.get(TABLE, id, option);
    };
  });
