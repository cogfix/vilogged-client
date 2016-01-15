'use strict';

angular.module('login')
  .service('loginService', function(authService) {
    var _this = this;

    _this.login = function (username, password) {
      return authService.login(username, password);
    }
  });
