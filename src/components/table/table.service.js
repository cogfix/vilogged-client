'use strict';

angular.module('viLoggedTable')
  .service('table', function () {
    var self = this;

    self.users = [
      {
        filter: true,
        field: 'first_name',
        label: 'First Name'
      },
      {
        filter: true,
        field: 'last_name',
        label: 'Last Name'
      },
      {
        filter: true,
        field: 'username',
        label: 'Username'
      },
      {
        filter: true,
        field: 'email',
        label: 'Email'
      },
      {
        filter: true,
        field: 'department.name',
        label: 'Department'
      },
      {
        filter: false,
        field: 'date_joined',
        label: 'Date Created',
        type: 'date'
      }
    ];

    self.appointments = [
      {
        filter: true,
        field: 'host',
        label: 'Host'
      },
      {
        filter: true,
        field: 'visitor',
        label: 'Guest'
      },
      {
        filter: true,
        field: 'start_date',
        label: 'Start Date',
        type: 'date'
      },
      {
        filter: true,
        field: 'end_date',
        label: 'End Date',
        type: 'date'
      },
      {
        filter: false,
        field: 'start_time',
        label: 'Start Time',
        type: 'date'
      },
      {
        filter: false,
        field: 'end_time',
        label: 'End Time',
        type: 'date'
      },
      {
        filter: false,
        field: 'status',
        label: 'Status'
      }
    ];

    self.visitors = [
      {
        filter: true,
        field: 'first_name',
        label: 'First Name'
      },
      {
        filter: true,
        field: 'last_name',
        label: 'Last Name'
      },
      {
        filter: true,
        field: 'email',
        label: 'Email'
      },
      {
        filter: true,
        field: 'phone',
        label: 'Phone'
      },
      {
        filter: true,
        field: 'type.name',
        label: 'Category'
      },
      {
        filter: true,
        field: 'company.name',
        label: 'Company'
      },
      {
        filter: false,
        field: 'created',
        label: 'Created Date'
      }
    ];
  });
