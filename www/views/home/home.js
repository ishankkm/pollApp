pollApp.controller('HomeController', [
  '$scope', 
  '$http', 
  '$state',
  function($scope, $http, $state) {

    $scope.addNewPoll = function() {
      console.log("newpoll button");
      $state.go('tabs.newpoll');            
    }
  }
]);