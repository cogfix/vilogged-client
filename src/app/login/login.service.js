'use strict';

angular.module('login')
  .service('loginService', function(authService) {
    var self = this;
  
    self.login = function (username, password) {
      return authService.login(username, password);
    }
  });
