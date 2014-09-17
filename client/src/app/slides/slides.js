'use strict';
/* global prettyPrint */
angular.module('AngularLibrisSdkPartner.Slides', [

])

.config(function config($stateProvider) {
  $stateProvider
    .state('slide', {
      abstract: true,
      views: {
        'main': {
          controller: 'SlidesCtrl',
          templateUrl: 'slides/common.tpl.html'
        }
      },
      data: {
        pageTitle: 'Slides'
      }
    })
    .state('slide.gettingStarted', {
      url: '/gettingStarted',
      views: {
        'slide': {
          templateUrl: 'slides/gettingStarted.tpl.html'
        }
      },
      data: {
        pageTitle: 'Getting Started',
        next: 'slide.createToken'
      }
    })
    .state('slide.createToken', {
      url: '/createToken',
      views: {
        'slide': {
          controller: 'SlideCreateTokenCtrl',
          templateUrl: 'slides/slides.tpl.html'
        }
      },
      data: {
        pageTitle: 'Create Token',
        next: 'slide.init',
        previous: 'slide.gettingStarted'
      }
    })
    .state('slide.init', {
      url: '/init',
      views: {
        'slide': {
          controller: 'InitApiCtrl',
          templateUrl: 'slides/initializingApi.tpl.html'
        }
      },
      data: {
        pageTitle: 'Initializing API',
        previous: 'slide.createToken'
      }
    });
})

.factory('AppSettings', function() {
  return {
    id: 'libris-contoso',
    secret: 'your-secret',
    proof: null,
    nonce: 0
  };
})

.controller('SlidesCtrl', function($log, $scope, $http, $timeout, $state, AppSettings, CONSTANTS) {
  $log.debug('started');

  $scope.app = AppSettings;
  $scope.app.id = CONSTANTS.SDK_APP_ID;
  $scope.app.secret = CONSTANTS.SDK_APP_SECRET;

  $scope.previousSlide = function() {
    $state.go($state.current.data.previous);
  };

  $scope.hasPrevious = function() {
    return ($state.current.data.previous && $state.current.data.previous.length > 0);
  };

  $scope.hasNext = function() {
    return ($state.current.data.next && $state.current.data.next.length > 0);
  };

  $scope.nextSlide = function() {
    $state.go($state.current.data.next);
  };

})

.controller('SlideCreateTokenCtrl', function($log, $scope, $http) {
  $log.debug('started');

  $scope.app.nonce = Math.floor(new Date().getTime() / 1000);

  $scope.runCode = function() {
    $log.debug('application id=', $scope.app.id);

    var toSignValue = $scope.app.id + '' + $scope.app.nonce;
    $log.debug(toSignValue);
    $http({
      method: 'GET',
      url: '/libris_sdk/proof_simulator',
      params: {
        'key': $scope.app.secret, //never do this. This is only for demonstration purpose. The key is always on the server and you don't pass this around!
        'toSign': toSignValue
      }
    })
      .success(function(data) {
        $log.debug(data);
        $scope.app.proof = data.proof;

      })
      .error(function(error_data) {
        $log.error(error_data);
      });
  };
})

.controller('InitApiCtrl', function($log, $scope, $http, $timeout) {
  $log.debug('InitApiCtrl started');
  $scope.running = false;
  $scope.apiResponse = '';

  $timeout(function() {
    try {
      prettyPrint();
    } catch (error) {
      $log.error('failed ', error);
    }
  }, 500);

  $scope.runCode = function() {
    $scope.running = true;
    //$log.debug('application id=', $scope.app.id);
    //var toSignValue = $scope.app.id + '' + $scope.your_nonce;
    // $log.debug(toSignValue);
    // $http({
    //   method: 'GET',
    //   url: '/libris_sdk/proof_simulator',
    //   params: {
    //     'key': $scope.app.secret, //never do this. This is only for demonstration purpose. The key is always on the server and you don't pass this around!
    //     'toSign': toSignValue
    //   }
    // })
    //   .success(function(data) {

    //$log.debug(data);
    LibrisAPI.init({
      'application_id': $scope.app.id,
      'nonce': $scope.app.nonce,
      'proof': $scope.app.proof,
      'debug': true,
      'jsonp_timeout': 5000,
      'postback': 'your_postback_url',
    }, function(d) {
      $scope.apiResponse = d;
      $scope.$apply();
      console.log(d);
    });

    // })
    // .error(function(error_data) {
    //   $log.error(error_data);
    // });
  };
});