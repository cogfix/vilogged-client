'use strict';

angular.module('log')
  .constant('ERROR_MESSAGES', {
    stateChangeError: {
      title: 'Application error',
      message: 'Could not load page',
      remedy: 'Please try that again'
    },
    unknownError: {
      title: 'Error',
      message: 'An error has occurred',
      remedy: 'Please try again'
    },
    authInvalid: {
      title: 'Authentication',
      message: 'Invalid username or password',
      remedy: 'Please try again'
    },
    networkError: {
      title: 'Network',
      message: 'Network error',
      remedy: 'Please check your internet connection and try again'
    },
    userExists: {
      title: 'Users',
      message: 'A user with the specified email exists',
      remedy: 'Please use another email address'
    },
    invalidUserId: {
      title: 'Users',
      message: 'Invalid user id',
      remedy: 'Please select a valid user from the list'
    },
    unauthorizedAccess: {
      title: 'Unauthorized access',
      message: 'You are not allowed to access or perform this operation',
      remedy: 'Please, re-login, try again if you have access and contact support if it persists'
    },
    updateConflict: {
      title: 'Document update conflict',
      message: 'The document you want to modified has been updated or created',
      remedy: 'Please, refresh and try again'
    },
    serverNotAvailable: {
      title: 'Server Offline',
      message: 'Please, check your connection again, it looks like you are offline',
      remedy: 'check if your internet connection or the api server is running'
    }
  });
