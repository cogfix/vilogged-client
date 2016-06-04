'use strict';

angular.module('viLogged')
	.controller('HomeCtrl', function(
		$window,
		log,
		utility,
		dialog,
		appointmentService
	) {

		var vm = this; //view models
    vm.eventSources = [];
    vm.uiConfig = {
      calendar:{
        height: 390,
        editable: true,
        header:{
          left: 'month',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function (day) {

        },
        eventDrop: function () {},
        eventResize: function () {}
      }
    };

		vm.getInProgress = function () {
			appointmentService.inProgress()
        .then(function (response) {
          vm.inProgress = response.results;
        });
		};

    vm.getUpcoming = function () {
      appointmentService.upcoming()
        .then(function (response) {
          vm.upcoming = response.results;
        })
    };

    vm.getAwaitingApproval = function () {
      appointmentService.awaitingApproval()
        .then(function (response) {
          vm.awaitingApproval = response.results;
        })
    };
    vm.getInProgress();
    vm.getUpcoming();
    vm.getAwaitingApproval();
	});
