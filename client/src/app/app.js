angular.module('AngularLibrisSdkPartner', [
  'ui.router',
  'ui.bootstrap',
  'templates-app'
])

.controller('AppController', function AppCtrl($log, $rootScope, $scope, $modal, $q, $state, $location) {
  $log.info("Angular App controller initialized");

  $scope.applicationInit = function() {
    $log.debug("initializing application");
  };
});