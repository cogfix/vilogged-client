'use strict';

angular.module('viLogged')
	.controller('HomeCtrl', function(
		$window,
		log,
		utility,
		dialog,
		appointmentService,
    $rootScope,
    $state,
    $compile,
    $scope
	) {
    if (!$rootScope.currentUser.is_superuser && !$rootScope.currentUser.is_staff) {
      $state.go('users.profile');
    }
		var vm = this; //view models
    vm.eventSources = [];

    function getCalendarEvents (appointments) {
      appointments = appointments || [];
      var events = [];
      var i = appointments.length;
      while (i--) {
        var appointment = appointments[i];
        events.unshift({
          id: appointment._id,
          start: new Date([appointment.start_date, appointment.start_time].join(' ')),
          end: new Date([appointment.start_date, appointment.end_time].join(' ')),
          allDay: false,
          title: [
            appointment.visitor.first_name,
            appointment.visitor.last_name,
            'and',
            appointment.host.first_name,
            appointment.host.last_name
          ].join(' ')
        })
      }
      vm.eventSources.push(events);
    }


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
          console.log(day);
        },
        eventClick: function (e) {
         $state.go('appointments.detail', {
           _id: e.id
         })
        },
        eventDrop: function (e) {
          console.log(e);
        },
        eventResize: function (e) {
          console.log(e);
        },
        eventRender: function( event, element, view ) {
          element.attr({'tooltip': event.title,
            'tooltip-append-to-body': true});
          $compile(element)($scope);
        }
      }
    };

		vm.getInProgress = function () {
			appointmentService.inProgress()
        .then(function (response) {
          vm.inProgress = response.results;
          getCalendarEvents(vm.inProgress);
        });
		};

    vm.getUpcoming = function () {
      appointmentService.upcoming()
        .then(function (response) {
          vm.upcoming = response.results;
          getCalendarEvents(vm.upcoming);
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
