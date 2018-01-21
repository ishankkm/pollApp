pollApp.controller('HomeController', [
	'$scope',
	'$http',
	'$firebaseAuth', '$firebaseArray',
	'$state',
	'$ionicModal',
	'$ionicPopup',
	function($scope, $http, $firebaseAuth, $firebaseArray, $state, $ionicModal, $ionicPopup	) {

		var ref = firebase.database().ref();
		var auth = $firebaseAuth();

		auth.$onAuthStateChanged(function(authUser) {

			if(authUser) {

				var userPollRef = ref.child('users').child(authUser.uid).child('polls');
				var userPollingInfo = $firebaseArray(userPollRef);
				$scope.polls = userPollingInfo;
				$scope.newpoll = {}
				$scope.addNewPoll = function() {
					$state.go('tabs.newpoll');
				}

				$scope.itemHandler = function (poll) {

					if (!poll.completed && poll.owner !== authUser.uid) {
						$state.go('tabs.pollroom', {pId: poll.pollid});
					} else {
						$state.go('tabs.polldetail', {pId: poll.pollid});
					}
				}

				// $scope.addPoll = function() {
				// 	$ionicModal.fromTemplateUrl('addpoll.html', {
				// 		scope: $scope
				// 	}).then(function(modal) {
				// 		$scope.addpollmodal = modal;
				// 		$scope.addpollmodal.show();
				// 	});
        //
				// }

				//Cleanup the modal when we're done with it!
				// $scope.$on('$destroy', function() {
				// 		$scope.addpollmodal.remove();
				// });

				$scope.fetchPoll = function(newPollid) {

					var myPolls = []
					$scope.polls.forEach(function(s) {
						myPolls.push(s.pollid);
					});

					if (myPolls.indexOf(newPollid) !== -1) {

						$ionicPopup.alert({
							 title: 'Survey Could not be added!',
							 template: 'Survey already exists'
						 });
						 return;
					}

					ref.child('polls').child(newPollid).once("value",

						function(snapshot) {
							if (snapshot.val() != null) {

								var pollKeys = Object.keys(snapshot.val());
								var poll = snapshot.val()[pollKeys[0]];

								// if (poll.owner != authUser.uid){
									userPollRef.child(newPollid).set({
										date: firebase.database.ServerValue.TIMESTAMP,
										pollid: newPollid,
										qCount: poll.questions.length,
										title: poll.title,
										owner: poll.owner,
										ownername: poll.ownername,
										completed: false,
										descr: poll.descr
									}).then(function() {
										$ionicPopup.alert({
											 title: 'Survey Added!',
											 template: 'The survey has been added to your list!'
										 });
									});
								// }

							} else {
								$ionicPopup.alert({
									 title: 'Survey Could not be added!',
									 template: 'Survey does not exist'
								 });
							}
						},

						function(err){
							console.log(err);
						}
					).then(function() {
						// $scope.addpollmodal.hide();
					});
				}

				$scope.deleteItem = function(poll) {

					userPollRef.child(poll.pollid).remove().then(function() {
						console.log("My Poll Removed");
					});

					// if (poll.owner == authUser.uid) {
					// 	ref.child('polls').child(poll.pollid).remove().then(function() {
					// 		console.log("Public Poll Removed");
					// 	});
					// }
				}

				$scope.addNewPollpopup = function(){
					var myPopup = $ionicPopup.show({
						 template: '<input type="text" ng-model="newpoll.id">',
						 title: 'Survey Code',
						 subTitle: 'Please enter a unique survey code.',
						 scope: $scope,
						 buttons: [
							 { text: 'Cancel' },
							 {
								 text: '<b>Add</b>',
								 type: 'button-positive',
								 onTap: function(e) {
									 if (!$scope.newpoll.id) {
										 //don't allow the user to close unless he enters wifi password
										 e.preventDefault();
									 } else {
										 return $scope.newpoll.id;
									 }
								 }
							 }
						 ]
					 });

					 myPopup.then(function(res) {
						 if (res) {
						 	result = $scope.fetchPoll(res);
					 		}
					 });
			 }
			} //authUser
	  }); //onAuthStateChanged
	}
]);
