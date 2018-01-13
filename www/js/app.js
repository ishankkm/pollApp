// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pollApp = angular.module('starter', ['ionic', 'firebase'])

pollApp
.run(
  [ '$ionicPlatform', 
    '$state', 
    '$rootScope',
    function($ionicPlatform, $state, $rootScope) {

      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });

      $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        if (error == 'AUTH_REQUIRED') {
          $rootScope.message = 'Sorry, you must log in to access that page';
          $state.go('login');
        }//Auth Required
      }); //$routeChangeError

    } // function
  ]
)

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    
    .state ('tabs', {
      abstract: true,
      url: '/tab',
      templateUrl: 'views/tabs.html',
      controller: 'tabController'
    })

    .state('tabs.home', {
      url:'/home',
      views: {
        'menuContent': {
          templateUrl: 'views/home/home.html',
          controller: 'HomeController'
        }
      },
      resolve: {
        currentAuth: function(Authentication) {
          return Authentication.requireAuth();
        }
      }
    })

    .state('tabs.newpoll', {
      url:'/newpoll',
      views: {
        'menuContent': {
          templateUrl: 'views/home/newpoll.html',
          controller: 'HomeController'
        }
      }
    })

    .state('login', {
      url:'/login',
      templateUrl: 'views/login/login.html',
      controller: 'LoginController'
    })
    
    .state('register', {
      url:'/register',
      templateUrl: 'views/register/register.html',
      controller: 'RegisterController'
    })

    $urlRouterProvider.otherwise('/tab/home');
})

.controller('tabController', [
  '$scope', 
  '$http', 
  '$state',
  'Authentication',
  function($scope, $http, $state, Authentication) {
    
    $scope.logout = function() { 
      Authentication.logout().then(function(user) {
        $state.go('login');
      });
    }
  }
])