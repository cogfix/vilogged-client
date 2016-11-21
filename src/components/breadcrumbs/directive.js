angular.module('breadcrumbs')
  .directive('viBreadcrumbs', function($log, breadcrumbService) {
    return {
      restrict: 'AE',
      template: 'this is the breadcrumbs',
      replace: true,
      compile: function(tElement, tAttrs) {
        return function($scope, $elem, $attr) {

        }
      }
    };

  });