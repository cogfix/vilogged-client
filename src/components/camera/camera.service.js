'use strict';

/**
 * @ngdoc service
 * @name viLoggedClientApp.cameraService
 * @description
 * # cameraService
 * Service in the viLoggedClientApp.
 */
angular.module('vi.camera')
  .service('cameraService', function ($window) {
    var hasUserMedia = function() {
      return !!getUserMedia();
    };

    var getUserMedia = function() {
      navigator.getUserMedia = ($window.navigator.getUserMedia ||
      $window.navigator.webkitGetUserMedia ||
      $window.navigator.mozGetUserMedia ||
      $window.navigator.msGetUserMedia);
      return navigator.getUserMedia;
    };

    return {
      hasUserMedia: hasUserMedia(),
      getUserMedia: getUserMedia
    }
  });