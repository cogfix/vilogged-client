'use strict';

angular.module('visitorsGroup')
  .controller('VisitorsGroupProfileCtrl', function (visitorsGroupService, $stateParams) {
    var vm = this;
    visitorsGroupService.get($stateParams._id)
      .then(function (response) {
        vm.profile = response;
      })
      .catch(function (reason) {

      });

  })
  .controller('RemoveVisitorsGroupProfileCtrl', function (visitorsGroupService, $state, $stateParams, authService) {
    var id = $stateParams._id;
    visitorsGroupService.remove(id)
      .then(function (response) {
        $state.go('visitorsGroup.all');
      })
      .catch(function (reason) {
        console.log(reason);
      });

  });