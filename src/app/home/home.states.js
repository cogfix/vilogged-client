'use strict';

angular.module('home')
		.config(function ($stateProvider) {
			$stateProvider.state('home', {
				parent: 'index',
				url: '/',
				controller: 'HomeCtrl',
				controllerAs: 'homeCtrl',
				templateUrl: 'app/home/home.html',
				data: {
					label: 'Dashboard',
					menu: true,
					icon: 'fa fa-home',
					order: 1
				},
        resolve: {
          permissions: function ($rootScope, aclService) {
            return aclService.getPermissions($rootScope.currentUser, 'users');
          }
        }
			});
		});
