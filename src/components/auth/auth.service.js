angular.module('auth')
  .service('authService', function ($q, $cookies, log, dbService) {
    var _this = this;

    _this.login = function (username, password) {
      return dbService.db.post('login', {username: username, password: password})
        .then(function (response) {
          var data = response;
          $cookies.putObject('vi-token', data.token);
          $cookies.putObject('vi-user', data.user);
          return response;
        });
    };

    _this.logout = function () {
      $cookies.remove('vi-token');
      $cookies.remove('vi-user');
    };

    _this.loggedIn = function () {
      return angular.isDefined($cookies.getObject('vi-token'));
    };

    _this.currentUser = function () {
      return $cookies.getObject('vi-user')
    };

    _this.updateCurrentUser = function (user) {
      var currentUser = _this.currentUser();
      for (var key in user) {
        if (user.hasOwnProperty(key)) {
          currentUser[key] = user[key];
        }
      }
      $cookies.putObject('vi-user', currentUser);
    }
  });