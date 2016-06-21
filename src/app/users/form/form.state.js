'use strict';

angular.module('users')
  .config(function ($stateProvider) {
    $stateProvider
      .state('users.add', {
        parent: 'users',
        url: '/add',
        templateUrl: 'app/users/form/form.html',
        controller: 'FormCtrl',
        controllerAs: 'formCtrl',
        data: data('Add User', 'fa fa-plus-square', 'users.all')
      })
      .state('users.edit', {
        parent: 'users',
        url: '/edit?_id',
        templateUrl: 'app/users/form/form.html',
        controller: 'FormCtrl',
        controllerAs: 'formCtrl',
        data: data('Edit User', 'fa fa-edit-square', 'users.all')
      })
      .state('users.changePassword', {
        parent: 'users',
        url: '/update-password',
        templateUrl: 'app/users/form/form.html',
        controller: 'FormCtrl',
        controllerAs: 'formCtrl',
        data: data('Edit User', 'fa fa-edit-square', 'users.all')
      });
  });
