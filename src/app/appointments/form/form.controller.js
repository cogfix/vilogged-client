'use strict';

angular.module('appointments')
  .controller('AFormCtrl', function (
    appointmentService,
    $state,
    $stateParams,
    utility,
    formService,
    userService,
    visitorService,
    $filter,
    $scope,
    dialogs
  ) {
    var COLUMN = 2;
    var vm = this;
    vm.errorMsg = {};
    vm.viewModel = {};
    vm.viewModel.start_date = new Date();
    vm.viewModel.end_date = new Date();
    vm.viewModel.start_time = new Date();
    vm.viewModel.end_time = moment().add(30, 'm').toDate();
    vm.viewModel.purpose = vm.viewModel.purpose || 'official';
    vm.teamMembers = [];
    vm.isSaving = false;
    vm.column = (12/COLUMN);
    vm.selected = {}; // hold selected user/visitor profile from typeahead

    vm.model = appointmentService.model;
    vm.form = formService.modelToForm(vm.model, COLUMN);
    vm.visitor = {
      exists: !formService.isEmpty($stateParams.visitor),
      _id: $stateParams.visitor
    };

    if (vm.visitor.exists) {
      visitorService.get(vm.visitor._id)
        .then(function (response) {
          vm.selected.visitor = response;
          vm.viewModel.visitor = [response.last_name, response.first_name].join(' ');
          vm.model.visitor.formType = 'text';
        })
        .catch()
    }
    var id = $stateParams._id;

    if (id) {
      appointmentService.get(id)
        .then(function (response) {
          reloadData(response)
        })
        .catch(function (reason) {
          console.log(reason);
        });
    }

    vm.save = function () {
      vm.isSaving = true;
      appointmentService.validate(vm.viewModel)
        .then(function (response) {
          validateVisitationTime();
          if (utility.isEmptyObject(response)) {
            vm.viewModel.host = vm.selected.host._id;
            vm.viewModel.visitor = vm.selected.visitor._id;
            vm.viewModel.start_date = $filter('date')(vm.viewModel.start_date, 'yyyy-MM-dd');
            vm.viewModel.end_date = $filter('date')(vm.viewModel.end_date, 'yyyy-MM-dd');
            vm.viewModel.start_time = $filter('date')(vm.viewModel.start_time, 'HH:mm:ss');
            vm.viewModel.end_time = $filter('date')(vm.viewModel.end_time, 'HH:mm:ss');
            if ($scope.currentUser._id === vm.selected.host._id) {
              vm.viewModel.is_approved = true;
            }
            if (vm.teamMembers.length > 0) {
              vm.viewModel.teams = vm.teamMembers.map(function (row) {
                return row._id;
              })
            }
            var currentAppointment = angular.copy(vm.viewModel);
            currentAppointment.visitor = vm.selected.visitor;
            currentAppointment.host = vm.selected.host;
            appointmentService.save(vm.viewModel)
              .then(function () {
                if (!id) {
                  appointmentService.sms(currentAppointment, 'created');
                  appointmentService.email(currentAppointment, 'created');
                }
                vm.isSaving = false;
                $state.go('appointments.all');
              })
              .catch(function (reason) {
                vm.isSaving = false;
                reloadData();
                angular.merge(vm.errorMsg, reason)
              });
          } else {
            vm.isSaving = false;
            vm.errorMsg = response;
          }
        })
        .catch(function (reason) {
          vm.isSaving = false;
          console.log(reason);
        });
    };
    vm.validateField = function (fieldName) {
      vm.errorMsg[fieldName] = [];
      var extraValidation = {};
      if (['start_time', 'end_time'].indexOf(fieldName) !== -1) {
        vm.errorMsg['start_time'] = [];
        vm.errorMsg['end_time'] = [];
        if (new Date(vm.viewModel.start_time).getTime() > new Date(vm.viewModel.end_time).getTime()) {
          vm.viewModel.end_time = moment(vm.viewModel.start_time).add(30, 'm');
        }
        extraValidation = appointmentService.dateTimeValidation(vm.viewModel.start_time, vm.viewModel.end_time, 'time',
          vm.viewModel);
      } else if (['start_date', 'end_date'].indexOf(fieldName) !== -1) {
        vm.errorMsg['start_date'] = [];
        vm.errorMsg['end_date'] = [];
        if (new Date(vm.viewModel.start_date).getTime() > new Date(vm.viewModel.end_date).getTime()) {
          vm.viewModel.end_date = vm.viewModel.start_date;
        }
        extraValidation = appointmentService.dateTimeValidation(vm.viewModel.start_date, vm.viewModel.end_date, 'date',
          vm.viewModel);
      } else if (fieldName === 'purpose') {
        extraValidation = appointmentService.dateTimeValidation(vm.viewModel.start_date, vm.viewModel.end_date, 'date',
          vm.viewModel);
      }

      if (vm.model.hasOwnProperty(fieldName)) {
        appointmentService.validateField(vm.viewModel[fieldName], fieldName, vm.viewModel['_id'])
          .then(function (response) {
            vm.errorMsg[fieldName] = response;
            vm.errorMsg = angular.merge(vm.errorMsg, extraValidation);
          })
          .catch(function (reason) {
            console.log(reason);
          })
      }
    };

    function openDatePicker ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      this.opened = !this.opened;
    }

    vm.date = {
      start_date: {
        opened: false,
        open: openDatePicker
      },
      end_date: {
        opened: false,
        open: openDatePicker
      }
    };

    vm.time = {
      start_time: {
        hstep: 1,
        mstep: 15,
        ismeridian: true,
        toggleMode: function () {
          this.ismeridian = !this.ismeridian;
        }
      },
      end_time: {
        hstep: 1,
        mstep: 15,
        ismeridian: true,
        toggleMode: function () {
          this.ismeridian = !this.ismeridian;
        }
      }

    };

    vm.typeahead = {
      host: {
        get: function (query) {
          return userService.all({q: query, 'only-fields': 'first_name,last_name,phone'})
            .then(function (response) {
              return response.results.map(function (row) {
                return {name: [row.last_name, row.first_name].join(' '), _id: row._id};
              });
            })
            .catch(function (reason) {
              console.log(reason);
            });
        },
        onSelect: function ($item) {
          vm.selected.host = $item;
        },
        editable: false,
        disabled: false
      },
      visitor: {
        get: function (query) {
          return visitorService.all({q: query, 'only-fields': 'first_name,last_name,phone'})
            .then(function (response) {
              return response.results.map(function (row) {
                return {name: [row.last_name, row.first_name].join(' '), _id: row._id};
              });
            })
            .catch(function (reason) {
              console.log(reason);
            });
        },
        onSelect: function ($item) {
          vm.selected.visitor = $item;
        },
        editable: false,
        disabled: vm.visitor.exists
      }
    };

    vm.placeholder = formService.placeholder;

    function validateVisitationTime () {
      var checkVisitTime = [];
      if (!formService.isEmpty(vm.viewModel.purpose) && vm.viewModel.purpose.toLowerCase() === 'personal') {
        var dayOfWeek = moment(vm.viewModel.start_date).weekday();
        var nameOfDay = moment.weekdaysShort(dayOfWeek);

        var visitStartTime = $filter('date')(vm.viewModel.start_time, 'HH:mm:ss').substr(0,2);
        var visitEndTime = $filter('date')(vm.viewModel.end_time, 'HH:mm:ss').substr(0,2);

        if (nameOfDay !== 'Tue' && nameOfDay !== 'Thu') {
          checkVisitTime.push('Personal visitors are only allowed on Tuesday and Thursday between 1pm and 3pm');
        } else if (visitStartTime < 13 || visitStartTime > 15 || visitEndTime > 15) {
          checkVisitTime.push('Personal visits are only allowed between the hours of 1pm and 3pm on Tuesday and Thursday');
        }
      }
      return {purpose: checkVisitTime};
    }

    function reloadData (response) {
      if (response) {
        vm.viewModel = response;
        vm.selected.host = vm.viewModel.host;
        vm.selected.visitor = vm.viewModel.visitor;
      }
      var startDate = angular.isString(vm.viewModel.start_date) ?  vm.viewModel.start_date : $filter('date')(vm.viewModel.start_date, 'yyyy-MM-dd');
      var endDate = angular.isString(vm.viewModel.end_date) ?  vm.viewModel.end_date : $filter('date')(vm.viewModel.end_date, 'yyyy-MM-dd');
      var startTime = angular.isString(vm.viewModel.start_time) ?  vm.viewModel.start_time : $filter('date')(vm.viewModel.start_time, 'HH:mm:ss');
      var endTime = angular.isString(vm.viewModel.end_time) ?  vm.viewModel.end_time : $filter('date')(vm.viewModel.end_time, 'HH:mm:ss');
      vm.viewModel.host = [vm.selected.host.last_name, vm.selected.host.first_name].join(' ');
      vm.viewModel.visitor = [vm.selected.visitor.last_name, vm.selected.visitor.first_name].join(' ');
      vm.viewModel.start_time = moment([startDate, startTime].join(' '), 'YYYY-MM-DD HH:mm:ss').toDate();
      vm.viewModel.end_time = moment([endDate, endTime].join(' '), 'YYYY-MM-DD HH:mm:ss').toDate();
      vm.teamMembers = vm.viewModel.teams;
    }

    vm.cancel = function () {
      $state.go('appointments.all');
    };

    vm.addMember = function () {
      var dlg = dialogs.create(
        'app/appointments/form/partials/visitor.html',
        'TeamMembersCtrl',
        {vm: vm},
        {size: 'sm'},
        'formCtrl'
      ).result;

      dlg
        .then(function (res) {
          var exist = vm.teamMembers.filter(function (row) {
            return res._id === row._id;
          });
          if (exist.length === 0) {
            vm.teamMembers.push(res);
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    };
  })
  .controller('TeamMembersCtrl', function (
    $scope,
    $modalInstance,
    data,
    visitorService,
    formService
  ) {
    var vm = this;
    var COLUMN = 1;
    vm.model = angular.copy(visitorService.model);
    vm.errorMsg = {};
    vm.viewModel = {};
    vm.column = (12/COLUMN);
    for (var key in vm.model) {
      if (vm.model.hasOwnProperty(key) && ['last_name', 'first_name', 'phone'].indexOf(key) === -1) {
        vm.model[key].hidden = true;
      }
      if (vm.model.hasOwnProperty(key) && ['last_name', 'first_name', 'phone'].indexOf(key) !== -1) {
        vm.model[key].formType = 'typeahead-remote';
      }

      if (key === 'phone') {
        vm.model[key].template = 'app/appointments/form/partials/phone.html'
      }
    }
    vm.phone = {
      prefixes: formService.phonePrefixes()
    };
    vm.form = formService.modelToForm(vm.model, COLUMN);

    vm.save = function () {
      vm.isSaving = true;
      if (!vm.viewModel._id) {
        vm.viewModel.phone = visitorService.getPhone(vm.viewModel['phone.prefix'], vm.viewModel['phone.suffix']);
        visitorService.validate(vm.viewModel)
          .then(function (response) {
            response = visitorService.updateForPhone(response);
            response = visitorService.updateForPrefix(response, vm.viewModel['phone.prefix']);
            if (utility.isEmptyObject(response)) {
              if (!visitorService.isEmpty(vm.viewModel['company.name'])) {
                vm.viewModel.company = {
                  name: vm.viewModel['company.name']
                }
              }

              if (!visitorService.isEmpty(vm.viewModel['company.address']) && !visitorService.isEmpty(vm.viewModel['company.name'])) {
                vm.viewModel.company.address = vm.viewModel['company.address'];
              }
              visitorService.save(vm.viewModel)
                .then(function (visitorProfile) {
                  vm.isSaving = false;
                  $modalInstance.close(visitorProfile);
                })
                .catch(function (reason) {
                  vm.isSaving = false;
                  angular.merge(vm.errorMsg, reason);
                });
            } else {
              vm.errorMsg = response;
            }
          })
          .catch(function (reason) {
            console.log(reason);
          });
      } else {
        vm.isSaving = false;
        $modalInstance.close(vm.viewModel);
      }
    };

    vm.cancel = function () {
      $modalInstance.dismiss('closed');
    };
    vm.validateField = function (fieldName) {
      vm.errorMsg[fieldName] = '';
      if (vm.model.hasOwnProperty(fieldName)) {
        if (fieldName === 'phone.suffix') {
          if (vm.viewModel['phone.prefix'] === 'Others') {
            vm.model['phone.suffix'].minLength = 6;
            vm.model['phone.suffix'].maxLength = 15;
          } else {
            vm.model['phone.suffix'].maxLength = 7;
            vm.model['phone.suffix'].minLength = 7;
          }
        } else if (fieldName === 'phone.prefix' && vm.viewModel['phone.prefix'] === 'Others') {
          return [];
        }
        visitorService.validateField(vm.model[fieldName], vm.viewModel[fieldName], vm.viewModel['_id'])
          .then(function (response) {
            vm.errorMsg[fieldName] = fieldName === 'phone.prefix' && response.length > 0 ? ['Please select from list'] : response;
          })
          .catch(function (reason) {
            console.log(reason);
          })
      }

      if (
        (fieldName === 'phone.prefix' || fieldName === 'phone.suffix') &&
        (!visitorService.isEmpty(vm.viewModel['phone.prefix']) &&
        !visitorService.isEmpty(vm.viewModel['phone.suffix']))
      ) {
        visitorService.validateField(vm.viewModel[fieldName], fieldName, vm.viewModel['_id'])
          .then(function (response) {
            if (response.length) {
              vm.errorMsg['phone'] = response;
            } else {
              vm.errorMsg['phone'] = '';
            }
          })
          .catch(function (reason) {
            console.log(reason);
          })
      }

    };

    vm.foundInList = {};

    vm.typeahead = {
      last_name: {
        get: function (query) {
          return visitorService.all({q: query, 'only-fields': 'first_name,last_name,phone'})
            .then(function (response) {
              return response.results.map(function (row) {
                vm.foundInList[row._id] = row;
                return {name: [row.last_name, row.first_name].join(' '), _id: row._id};
              });
            })
            .catch(function (reason) {
              console.log(reason);
            });
        },
        onSelect: function ($item) {
          console.log($item);
        },
        editable: true,
        disabled: false
      },
      'phone.suffix': {
        get: function (entry) {
          var prefix = vm.viewModel['phone.prefix'] || '';
          console.log(vm.viewModel)
          var query = [prefix, entry].join('')
          return visitorService.all({q: query, 'only-fields': 'first_name,last_name,phone'})
            .then(function (response) {
              return response.results.map(function (row) {
                vm.foundInList[row._id] = row;
                return {name: [[row.last_name, row.first_name].join(' '), row.phone].join('<br>'), _id: row._id};
              });
            })
            .catch(function (reason) {
              console.log(reason);
            });
        },
        onSelect: function ($item) {
          vm.viewModel = vm.foundInList[$item._id];
          vm.viewModel['company.name'] = vm.viewModel.company.name;
          vm.viewModel['company.address'] = vm.viewModel.company.address;
          var phone = visitorService.recoverPhone(vm.viewModel.phone);
          vm.viewModel = angular.merge({}, vm.viewModel, phone);
        },
        editable: true
      },
      first_name: {
        get: function (query) {
          return visitorService.all({q: query, 'only-fields': 'first_name,last_name,phone'})
            .then(function (response) {
              return response.results.map(function (row) {
                vm.foundInList[row._id] = row;
                return {name: [[row.last_name, row.first_name].join(' '), row.phone].join('<br>'), _id: row._id};
              });
            })
            .catch(function (reason) {
              console.log(reason);
            });
        },
        onSelect: function ($item) {
          vm.viewModel = vm.foundInList[$item._id];
          vm.viewModel['company.name'] = vm.viewModel.company.name;
          vm.viewModel['company.address'] = vm.viewModel.company.address;
          var phone = visitorService.recoverPhone(vm.viewModel.phone);
          vm.viewModel = angular.merge({}, vm.viewModel, phone);
        },
        editable: true
      }
    };

  });
