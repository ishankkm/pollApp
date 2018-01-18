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

				$scope.pollQues = {}
        $scope.userPollList = { qCount: 0 }
        $scope.publicPollList = { questions: [] }
        $scope.pollid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6).toUpperCase();

				var userPollRef = ref.child('users').child(authUser.uid).child('polls');
				var userPollingInfo = $firebaseArray(userPollRef);

				var publicPolls = ref.child('polls').child($scope.pollid);
				var publicPollsInfo = $firebaseArray(publicPolls);

				var pollInvites = ref.child('pollInvites');

				$scope.isPollActive = false;

				$scope.createPoll = function(type) {

						$scope.pollQues.type = type;
            $scope.publicPollList.questions.push(new Object($scope.pollQues));

            $scope.userPollList.qCount += 1;
						$scope.userPollList.date = firebase.database.ServerValue.TIMESTAMP;

            $scope.modal.hide();
            $scope.pollQues = {}

				}

        $scope.publishpolls = function() {

          $scope.userPollList.title = $scope.title;
					$scope.userPollList.pollid = $scope.pollid;
					console.log($scope.userPollList)
          userPollingInfo.$add($scope.userPollList).then(
            function() {
              $scope.isPollActive = true;
            }
          );

          $scope.publicPollList.title = $scope.title;
					$scope.publicPollList.owner = authUser.uid;
          $scope.publicPollList.descr = "Lorem Ipsum Dolor Sit!"
          publicPollsInfo.$add($scope.publicPollList).then(
            function(poll){
              // publicPolls.update({uid: poll.key});
              console.log("Published");
            }
          );
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
