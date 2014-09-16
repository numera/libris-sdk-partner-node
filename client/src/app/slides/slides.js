'use strict';

angular.module('AngularLibrisSdkPartner.slides', [
  'ui.router'
])

.config(function config($stateProvider) {
  $stateProvider
    .state('slides', {
      url: '/slides',
      views: {
        'main': {
          controller: 'SlidesCtrl',
          templateUrl: 'slides/slides.tpl.html'
        }
      },
      data: {
        pageTitle: 'Slides'
      }
    });
})

.controller('SlidesCtrl', function($log, $scope, $http) {
  $log.debug('started');

  $scope.applicationId = 'your-application-id';
  $scope.applicationSecret = 'your-secret';
  $scope.demoNonce = Math.floor(new Date().getTime() / 1000);
  $scope.running = false;

  prettyPrint();

  $scope.runCode = function() {
    $scope.running = true;

    $log.debug('application id=', $scope.applicationId);
    var toSignValue = $scope.applicationId + '' + $scope.demoNonce;
    $log.debug(toSignValue);
    $http({
      method: 'GET',
      url: '/libris_sdk/proof_simulator',
      params: {
        'key': $scope.applicationSecret, //never do this. This is only for demonstration purpose. The key is always on the server and you don't pass this around!
        'toSign': toSignValue
      }
    })
      .success(function(data) {
        $log.debug(data);
        $scope.demoProof = data;

      })
      .error(function(error_data) {
        $log.error(error_data);
      });
  };
});