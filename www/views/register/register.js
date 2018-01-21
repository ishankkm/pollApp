pollApp.controller('RegisterController', [
  '$scope',
  '$http',
  '$state',
  'Authentication',
  function($scope, $http, $state, Authentication) {
    $scope.user = {'email':'', 'password':'', 'firstname':'', 'lastname':'' };
    $scope.register = function() {

      $scope.user.displayName = $scope.user.firstname + " " + $scope.user.lastname;
      console.log($scope.user);
      Authentication.register($scope.user);
    }
  }
])
