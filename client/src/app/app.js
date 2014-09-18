'use strict';
/* global prettyPrintOne, Prism */
/*jshint quotmark: false */
angular.module('AngularLibrisSdkPartner', [
  'ui.router',
  'ui.bootstrap',
  'templates-app',
  'AngularLibrisSdkPartnerConfig',
  'AngularLibrisSdkPartner.Slides'
])

.config(function($urlRouterProvider, $logProvider) {
  $logProvider.debugEnabled(true);
  $urlRouterProvider.otherwise('/gettingStarted');
})

.directive('prettyprint', function($compile) {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      source: '@'
    },
    link: function(scope, element, attrs, controller, transclude) {
      scope.$watch('source', function(v) {
        element.find('code').html(v);
        prettyPrintOne(element.find('code')[0], '', true);
      });

      transclude(function(clone) {
        if (clone.html() !== undefined) {
          element.find('code').html(clone.html());
          $compile(element.contents())(scope.$parent);
        }
      });
    },
    template: '<code></code>'
    // link: function postLink(scope, element) {
    //   // transclude(scope.$parent, function(clone) {
    //   //   $log.debug(clone);
    //   //   element.append(prettyPrintOne(clone), '', true);
    //   // });
    //   //$log.debug(element.html());
    //   element.html(prettyPrintOne(element.html(), '', true));
    // }
  };
})

.directive('nagPrism', ['$compile', '$timeout',
  function($compile, $timeout) {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        source: '@',
        watch: '@'
      },
      link: function(scope, element, attrs, controller, transclude) {
        scope.$watch('source', function(v) {
          element.find("code").html(v);
          Prism.highlightElement(element.find("code")[0]);
        });
        var c;
        transclude(function(clone) {
          if (clone.html() !== undefined) {
            c = clone.html();
            element.find("code").html(c);
            $compile(element.contents())(scope.$parent);
          }
        });
        scope.$watch('watch', function() {

          element.find("code").html(c);
          $compile(element.contents())(scope.$parent);
          $timeout(function() {
            Prism.highlightElement(element.find("code")[0]);
          });
        });
      },
      template: "<code></code>"
    };
  }
])

.filter('password', function() {
  return function(input) {
    return input.replace(/./g, '*');
  };
})

.controller('AppController', function AppCtrl($log, $rootScope, $scope) {
  $log.info('Angular App controller initialized');

  $scope.applicationInit = function() {
    $log.debug('Initializing application control');

  };
});