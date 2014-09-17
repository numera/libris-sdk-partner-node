'use strict';

angular.module('AngularLibrisSdkPartner', [
  'ui.router',
  'ui.bootstrap',
  'templates-app',
  'AngularLibrisSdkPartner.slides'
])

.config(function($urlRouterProvider, $logProvider) {
  $logProvider.debugEnabled(true);

  $urlRouterProvider.otherwise('/gettingStarted');
})

// .directive('prettyprint', function($log) {
//   return {
//     restrict: 'C',
//     link: function postLink(scope, element) {
//       $log.debug(element.html());
//       //element.html(prettyPrintOne(element.html(), '', true));
//     }
//   };
// })

.controller('AppController', function AppCtrl($log, $rootScope, $scope) {
  $log.info('Angular App controller initialized');

  $scope.applicationInit = function() {
    $log.debug('Initializing application control');

  };
});