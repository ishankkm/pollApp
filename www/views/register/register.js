pollApp.controller('RegisterController', [
  '$scope', 
  '$http', 
  '$state',
  'Authentication',
  function($scope, $http, $state, Authentication) {
    $scope.user = {'email':'', 'password':'', 'firstname':'', 'lastname':'' };
    $scope.register = function() {
      console.log($scope.user);
      Authentication.register($scope.user);
    }
  }
])