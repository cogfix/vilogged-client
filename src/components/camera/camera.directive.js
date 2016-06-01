'use strict';

/**
 * @ngdoc directive
 * @name viLoggedClientApp.directive:viCamera
 * @description
 * # viCamera
 */
angular.module('vi.camera')
  .directive('viCamera', function(cameraService, $rootScope) {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      scope: {

      },
      controller: function($state, $scope, $timeout, $q) {
        this.takeSnapshot = function() {
          var canvas  = document.querySelector('canvas'),
              ctx     = canvas.getContext('2d'),
              videoElement = document.querySelector('video'),
              d       = $q.defer();

          canvas.width = $scope.w;
          canvas.height = $scope.h;

          $timeout(function() {
            ctx.fillRect(0, 0, $scope.w, $scope.h);
            ctx.drawImage(videoElement, 0, 0, $scope.w, $scope.h);
            d.resolve(canvas.toDataURL());
          }, 0);
          return d.promise;
        }
      },
      template: '<div class="camera"><video class="camera" autoplay="" width="300px" /><div ng-transclude></div></div>',
      link: function(scope, element, attrs) {
        var w = attrs.width || 280,
            h = attrs.height || 300;

        if (!cameraService.hasUserMedia) return;
        var userMedia = cameraService.getUserMedia(),
            videoElement = document.querySelector('video');
        // We'll be placing our interaction inside of here

        var onSuccess = function(stream) {
          cameraService.instance.stream = stream;
          $rootScope.$broadcast('camSuccess', {stream: stream})
          if (navigator.mozGetUserMedia) {
            videoElement.mozSrcObject = stream;
          } else {
            var vendorURL = window.URL || window.webkitURL;
            videoElement.src = window.URL.createObjectURL(stream);
          }
          // Just to make sure it autoplays
          videoElement.play();
        };
// If there is an error
        var onFailure = function(err) {
          console.error(err);
        };
// Make the request for the media
        navigator.getUserMedia({
          video: {
            mandatory: {
              maxHeight: h,
              maxWidth: w
            }
          },
          audio: false
        }, onSuccess, onFailure);

        scope.w = w;
        scope.h = h;


      }
    };
  })
  .directive('cameraControlSnapshot', function($rootScope) {
    return {
      restrict: 'EA',
      require: '^viCamera',
      scope: true,
      template: '<a class="btn btn-info" ng-model="formCtrl.viewModel.image" ng-change="takenSnapshot()" ng-click="takeSnapshot()"><i class="fa fa-eye">' +
      '</i> Take Snapshot</a>' +
      '<button type="button" ng-disabled="!takenImg" style="margin-left: 10px" class="btn btn-danger" ng-click="closeCameraNow()">' +
      '<i class="fa fa-times-circle-o"></i> Save Picture</button>',
      link: function(scope, ele, attrs, cameraCtrl) {
        scope.takeSnapshot = function() {
          cameraCtrl.takeSnapshot()
            .then(function(image) {
              $rootScope.takenImg = image;
              $rootScope.$broadcast('picTaken', {
                image: image
              });
            });
        }
      }
    }
  });
