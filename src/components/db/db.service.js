'use strict';

/**
 * @name storageService
 * @desc
 */
angular.module('db')
  .service('dbService', function(config, pouchDB, driverService, utility, $cookies) {
  
    var self = this;

    var db = driverService.get();
  
    self.get = function (table, id, option) {
      return db.get(table, id, option);
    };
  
    self.all = function (table, option) {
      return db.all(table, option);
    };
  
    self.save = function (table, doc, option) {
      if (!doc.hasOwnProperty('_id')) {
        doc['_id'] = utility.getUUID();
        doc['created'] = new Date().toJSON();
        doc['created_by'] = self.currentUser()._id;
      } else {
        doc['modified'] = new Date().toJSON();
        doc['modified_by'] = self.currentUser()._id;
        doc['created_by'] = doc['created_by'] || self.currentUser()._id;
      }

      return db.put(table, doc, option);
    };
  
    self.remove = function (table, id) {
      return db.remove(table, id);
    };
  
    self.currentUser = function () {
      return $cookies.getObject('vi-user')
    };
  
    self.db = db;
  
    self.tables = {
      APPOINTMENT: 'appointment',
      APPOINTMENT_LOGS: 'appointment-logs',
      COMPANIES: 'company',
      DEPARTMENT: 'department',
      ENTRANCE: 'entrance',
      MESSENGER: 'messenger',
      RESTRICTED_ITEMS: 'restricted-items',
      USER: 'user',
      VEHICLES: 'vehicle',
      VISITOR: 'visitor',
      VISITORS_TYPES: 'visitor-types'
    };
  });
