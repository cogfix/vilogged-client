'use strict';

/**
 * @name storageService
 * @desc
 */
angular.module('db')
  .service('dbService', function(config, pouchDB, driverService, utility, $cookies) {

    var _this = this;

    var db = driverService.get();

    _this.get = function (table, id, option) {
      return db.get(table, id, option);
    };

    _this.all = function (table, option) {
      return db.all(table, option);
    };

    _this.save = function (table, doc, option) {
      if (!doc.hasOwnProperty('_id')) {
        doc['_id'] = utility.getUUID();
        doc['created'] = new Date().toJSON();
        doc['created_by'] = _this.currentUser()._id;
      } else {
        doc['modified'] = new Date().toJSON();
        doc['modified_by'] = _this.currentUser()._id;
        doc['created_by'] = doc['created_by'] || _this.currentUser()._id;
      }

      return db.put(table, doc, option);
    };

    _this.remove = function (table, id) {
      return db.remove(table, id);
    };

    _this.currentUser = function () {
      return $cookies.getObject('vi-user')
    };

    _this.db = db;

    _this.tables = {
      APPOINTMENT: 'appointment',
      APPOINTMENT_LOGS: 'appointment-logs',
      COMPANIES: 'company',
      DEPARTMENT: 'department',
      ENTRANCE: 'entrance',
      RESTRICTED_ITEMS: 'restricted-items',
      USER: 'user',
      VEHICLES: 'vehicle',
      VISITOR: 'visitor',
      VISITORS_GROUP: 'visitor-group'
    };
  });
