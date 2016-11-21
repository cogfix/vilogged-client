angular.module('auth')
  .service('authService', function ($q, $rootScope, log, dbService, $window, $cookies) {
    var self = this;

    self.login = function (username, password) {
      return dbService.db.post('login', {username: username, password: password})
        .then(function (response) {
          if (!response) {
            return $q.reject(response);
          }
          var data = response;
          localforage.setItem('vi-token', data.token);
          localforage.setItem('vi-user', data.user);
          $cookies.putObject('vi-token', data.token);
          $rootScope.currentUser = data.user;
          $rootScope.$broadcast('loggedIn', data);
          return response;
        });
    };

    self.logout = function () {
      localforage.removeItem('vi-token');
      localforage.removeItem('vi-user');
      $rootScope.currentUser = {};
      $rootScope.token = '';
      $cookies.remove('vi-token');
      $window.location.href = '#/login';
    };

    self.loggedIn = function () {
      $rootScope.currentUser = $rootScope.currentUser || {};
      return Object.keys($rootScope.currentUser) > 0;
    };

    self.currentUser = function () {
      return $rootScope.currentUser;
    };

    self.updateCurrentUser = function (user) {
      var currentUser = self.currentUser();
      if (user._id === currentUser._id) {
        for (var key in user) {
          if (user.hasOwnProperty(key)) {
            currentUser[key] = user[key];
          }
        }
        localforage.setItem('vi-user', currentUser);
        $rootScope.currentUser = currentUser;
      }
    }
  });
