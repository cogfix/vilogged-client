angular.module('auth')
  .service('authService', function ($q, $cookies, log, dbService) {
    var self = this;

    self.login = function (username, password) {
      return dbService.db.post('login', {username: username, password: password})
        .then(function (response) {
          if (!response) {
            return $q.reject(response);
          }
          var data = response;
          $cookies.putObject('vi-token', data.token);
          $cookies.putObject('vi-user', data.user);
          return response;
        });
    };

    self.logout = function () {
      $cookies.remove('vi-token');
      $cookies.remove('vi-user');
    };

    self.loggedIn = function () {
      return angular.isDefined($cookies.getObject('vi-token'));
    };

    self.currentUser = function () {
      return $cookies.getObject('vi-user')
    };

    self.updateCurrentUser = function (user) {
      var currentUser = self.currentUser();
      for (var key in user) {
        if (user.hasOwnProperty(key)) {
          currentUser[key] = user[key];
        }
      }
      $cookies.putObject('vi-user', currentUser);
    }
  });
