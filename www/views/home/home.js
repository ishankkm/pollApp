pollApp.controller('HomeController', [
	'$scope',
	'$http',
	'$firebaseAuth', '$firebaseArray',
	'$state',
	function($scope, $http, $firebaseAuth, $firebaseArray, $state) {

		var ref = firebase.database().ref();
		var auth = $firebaseAuth();

		auth.$onAuthStateChanged(function(authUser) {

			if(authUser) {

				var userPollRef = ref.child('users').child(authUser.uid).child('polls');
				var userPollingInfo = $firebaseArray(userPollRef);

				var publicPolls = ref.child('polls');
				var publicPollsInfo = $firebaseArray(publicPolls);

				$scope.polls = userPollingInfo;
				$scope.pollQues = {}
				$scope.pollQues.pollid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6).toUpperCase();
				$scope.isPollActive = false;

				} //authUser
	    }
	  ); //onAuthStateChanged

		$scope.addNewPoll = function() {
			// $scope.pollQues = {}
			$state.go('tabs.newpoll');
		}

		$scope.goToPoll = function() {
			$state.go('tabs.pollroom');
		}
	}
]);
