pollApp.controller('LoginController', [
  '$scope', 
  '$http', 
  '$state',
  'Authentication',
  function($scope, $http, $state, Authentication) {
    $scope.user = {'email':'', 'password':'' };
    $scope.login = function() {
      
      Authentication.login($scope.user);
            
    }
  }
])