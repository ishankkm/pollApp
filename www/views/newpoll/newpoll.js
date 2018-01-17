pollApp.controller('NewpollController', [
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

				var publicPolls = ref.child('polls');
				var publicPollsInfo = $firebaseArray(publicPolls);

				$scope.polls = userPollingInfo;
				$scope.pollQues = {}
				$scope.pollQues.pollid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6).toUpperCase();
				$scope.isPollActive = false;

				$scope.createPoll = function(type) {

						$scope.pollQues.type = type;
						var publicPollQues = Object.assign({}, $scope.pollQues);
						$scope.pollQues.date = firebase.database.ServerValue.TIMESTAMP;

						$scope.pollQues.owner = true;

						userPollingInfo.$add($scope.pollQues).then(
							function() {
								$scope.isPollActive = true;
							}
						);

						publicPollsInfo.$add(publicPollQues).then(function(poll){
							console.log(poll.key);
							publicPolls.child(poll.key).update({uid: poll.key});
						});

            $scope.modal.hide();
				}

        $ionicModal.fromTemplateUrl('itemmodal.html', {
          scope: $scope
        }).then(function(modal) {
          $scope.modal = modal;
        });

        $scope.itemmodal = function() {
          $scope.modal.show();
        }

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

			} //authUser
    }); //onAuthStateChanged
	}
]);
