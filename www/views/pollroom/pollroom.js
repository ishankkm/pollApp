pollApp.controller('PollroomController', [
	'$scope',
	'$http',
	'$firebaseAuth', '$firebaseArray',
	'$state',
	'$ionicPopup',
	function($scope, $http, $firebaseAuth, $firebaseArray, $state, $ionicPopup) {

		var ref = firebase.database().ref();
		var auth = $firebaseAuth();

		auth.$onAuthStateChanged(function(authUser) {

			if(authUser) {

				var publicPoll = ref.child('polls').child($state.params.pId);
				var userpoll = ref.child('users').child(authUser.uid).child('polls').child($state.params.pId);
				var pollKeys;

				if (userpoll.completed == true){
					console.log("Error");
				}

				publicPoll.once("value",

					function(snapshot) {
						if (snapshot.val() != null) {

							pollKeys = Object.keys(snapshot.val());
							$scope.poll = snapshot.val()[pollKeys[0]];

						} else {
							console.log(snapshot.val() == null)
						}
					},

					function(err){
						console.log(err);
					}
				)

				$scope.castVote = function() {
					var response = [];
					$scope.poll.questions.forEach(function(ques) {
						response.push({
							qid: ques.qid,
							ans: ques.selected
						})
					});
					publicPoll.child(pollKeys[0]).child('responses').push(response).then(function() {
						$scope.pollcomplete = true;
						userpoll.child('completed').set(true);
						$scope.showAlert();
					});
				}
				$scope.showAlert = function() {
			   var alertPopup = $ionicPopup.alert({
			     title: 'Survey Complete!',
			     template: 'Your Response has been recorded!'
			   });

			   alertPopup.then(function(res) {
			     $state.go('tabs.polldetail', {pId: $state.params.pId});
			   });
			 };

    	} //authUser
  	}); //onAuthStateChanged
	}
]);
