pollApp.controller('PollroomController', [
	'$scope',
	'$http',
	'$firebaseAuth', '$firebaseArray',
	'$state',
	'$ionicPopup',
	'$ionicLoading',
	'$timeout',
	function($scope, $http, $firebaseAuth, $firebaseArray, $state, $ionicPopup, $ionicLoading, $timeout) {

		var ref = firebase.database().ref();
		var auth = $firebaseAuth();

		$scope.showloading = function() {
				$ionicLoading.show({
						template: 'Loading...'
				});

				// For example's sake, hide the sheet after two seconds
				$timeout(function() {
						$ionicLoading.hide();
				}, 5000);
		};
		$scope.hideloading = function(){
			$ionicLoading.hide();
		};

		auth.$onAuthStateChanged(function(authUser) {

			if(authUser) {

				var publicPoll = ref.child('polls').child($state.params.pId);
				var userpoll = ref.child('users').child(authUser.uid).child('polls').child($state.params.pId);
				var pollKeys;

				if (userpoll.completed == true){
					console.log("Error");
				}
				$scope.showloading();
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
				).then(function() {
					$scope.hideloading();
				})

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
						 $state.go('tabs.home');
			   });
			 };

    	} //authUser
  	}); //onAuthStateChanged
	}
]);
