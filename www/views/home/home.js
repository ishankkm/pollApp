pollApp.controller('HomeController', [
	'$scope',
	'$http',
	'$firebaseAuth', '$firebaseArray',
	'$state',
	'$ionicModal',
	function($scope, $http, $firebaseAuth, $firebaseArray, $state, $ionicModal) {

		var ref = firebase.database().ref();
		var auth = $firebaseAuth();

		auth.$onAuthStateChanged(function(authUser) {

			if(authUser) {

				var userPollRef = ref.child('users').child(authUser.uid).child('polls');
				var userPollingInfo = $firebaseArray(userPollRef);
				$scope.polls = userPollingInfo;


				$scope.addNewPoll = function() {
					$state.go('tabs.newpoll');
				}

				// $ionicModal.fromTemplateUrl('addpoll.html', {
				// 	scope: $scope
				// }).then(function(modal) {
				// 	$scope.addpollmodal = modal;
				// });

				$scope.addPoll = function() {
					$ionicModal.fromTemplateUrl('addpoll.html', {
						scope: $scope
					}).then(function(modal) {
						$scope.addpollmodal = modal;
						$scope.addpollmodal.show();
					});
				}

				//Cleanup the modal when we're done with it!
				$scope.$on('$destroy', function() {
						$scope.addpollmodal.remove();
				});

				$scope.fetchPoll = function(newPollid) {
					console.log(newPollid);

					ref.child('polls').child(newPollid).once("value",

						function(snapshot) {
							if (snapshot.val() != null) {

								var pollKeys = Object.keys(snapshot.val());
								var poll = snapshot.val()[pollKeys[0]];

								if (poll.owner != authUser.uid){
									userPollRef.child(newPollid).set({
										date: firebase.database.ServerValue.TIMESTAMP,
										pollid: newPollid,
										qCount: poll.questions.length,
										title: poll.title,
										owner: poll.owner
									});
								}

							} else {
								console.log(snapshot.val() == null)
							}
						},

						function(err){
							console.log(err);
						}
					).then(function() {
						$scope.addpollmodal.hide();
					});
				}

			} //authUser
	  }); //onAuthStateChanged
	}
]);
