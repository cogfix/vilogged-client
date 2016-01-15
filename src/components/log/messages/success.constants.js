'use strict';

angular.module('log')
  .constant('SUCCESS_MESSAGES', {
    authSuccess: {
      title: 'Authentication',
      message: 'Login success'
    },
    userCreated: {
      title: 'Users',
      message: 'User created'
    },
    userUpdated: {
      title: 'Users',
      message: 'User updated'
    },
    userRemoved: {
      title: 'Users',
      message: 'User deleted'
    },
    logoutSuccess: {
      title: 'Logout Success',
      message: 'You\'ve been logged out of the system successfully!'
    },
    recordRemovedSuccessfully: {
      title: 'Record Removed',
      message: 'Record Removed Successfully'
    }

  });
