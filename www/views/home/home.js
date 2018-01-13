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

				var pollingRef = ref.child('users').child(authUser.uid).child('polls');
				var pollingInfo = $firebaseArray(pollingRef);

				$scope.polls = pollingInfo;
				$scope.pollQues = {}
				$scope.isPollActive = false;

				$scope.createPoll = function() {

					pollingInfo.$add({

						question: $scope.pollQues.question,
						option1: $scope.pollQues.op1,
						option2: $scope.pollQues.op2,
						option3: $scope.pollQues.op3,
						option4: $scope.pollQues.op4,
						date: firebase.database.ServerValue.TIMESTAMP

					}).then(function() {
						console.log($scope.pollQues);
						$scope.isPollActive = true;
					});
				}

      } //authUser
    }); //onAuthStateChanged

		$scope.addNewPoll = function() {
			$state.go('tabs.newpoll');   
			$scope.pollQues = {}       
		}

		$scope.goToPoll = function() {

		}
	}
]);