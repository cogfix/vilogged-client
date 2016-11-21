angular.module('users')
  .config(function ($stateProvider) {
    $stateProvider
      .state('users.all', {
        url: '/all',
        parent: 'users',
        templateUrl: 'app/users/all/all.html',
        controller: 'UserAllCtrl',
        controllerAs: 'allCtrl',
        resolve: {
          currentState: function (userService) {
            return userService.getState()
              .catch(function () {
                return {};
              });
          }
        }
      });
  });
