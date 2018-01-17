pollApp.controller('PollroomController', [
	'$scope', 
	'$http', 
	'$firebaseAuth', '$firebaseArray',
	'$state',
	function($scope, $http, $firebaseAuth, $firebaseArray, $state) {

		var ref = firebase.database().ref();
		var auth = $firebaseAuth();


		auth.$onAuthStateChanged(function(authUser) {

			if(authUser) {

				var publicPolls = ref.child('polls');

				var pollKeys = "";

				$scope.fetchPoll = function(pollKey) {

					publicPolls.orderByChild("pollid").equalTo(pollKey).once("value", 

						function(snapshot) {
							if (snapshot.val() != null) {
								
								pollKeys = Object.keys(snapshot.val());
								$scope.pollQues = snapshot.val()[pollKeys[0]];
							} else {
								console.log(snapshot.val() == null)
							}						  
						}, 

						function(err){
							console.log(err);
						}
					).then(function() {
						$scope.isPollRoomActive = true;
						$state.reload();
					});
				}

				$scope.castVote = function(pollAns) {
					// .$getRecord(pollKeys[0])
					res = {};
					res[authUser.uid] = pollAns;

					publicPolls.child(pollKeys[0]).child('responses').update(new Object(res)).then(
						function() {
							$scope.polled = true;
							$state.reload();
							console.log(res)
						}
					);
				}

      		} //authUser
    	}); //onAuthStateChanged
	}
]);