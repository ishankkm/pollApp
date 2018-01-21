pollApp.controller('NewpollController', [
	'$scope',
	'$http',
	'$firebaseAuth', '$firebaseArray',
	'$state',
  '$ionicModal',
	'$ionicPopup',
	function($scope, $http, $firebaseAuth, $firebaseArray, $state, $ionicModal, $ionicPopup) {

		var ref = firebase.database().ref();
		var auth = $firebaseAuth();

		auth.$onAuthStateChanged(function(authUser) {

      if(authUser) {

				$scope.pollQues = {}
        $scope.userPollList = { qCount: 0 }
        $scope.publicPollList = { questions: [] }
        $scope.pollid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6).toUpperCase();
				$scope.header = {};

				var userPollRef = ref.child('users').child(authUser.uid);

				var publicPolls = ref.child('polls').child($scope.pollid);
				var publicPollsInfo = $firebaseArray(publicPolls);

				var pollInvites = ref.child('pollInvites');

				userPollRef.once("value",

					function(snapshot) {
						if (snapshot.val() != null) {
							$scope.user = snapshot.val();
						} else {
							console.log(snapshot.val() == null)
						}
					},

					function(err){
						console.log(err);
					}
				)

				$scope.isPollActive = false;
				$scope.createPoll = function(type) {

						if ($scope.pollQues.editmode) {
							$scope.publicPollList.questions[$scope.pollQues.editindex] = $scope.pollQues;
							$scope.pollQues.editmode = false;
							$scope.pollQues.editindex = -1;
							$scope.modal.hide();
	            $scope.pollQues = {}
							return;
						}

						$scope.pollQues.type = type;
						$scope.pollQues.qid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);
            $scope.publicPollList.questions.push(new Object($scope.pollQues));

            $scope.userPollList.qCount += 1;
						$scope.userPollList.date = firebase.database.ServerValue.TIMESTAMP;

            $scope.modal.hide();
            $scope.pollQues = {}

				}

				$scope.deleteItem = function(index) {
					$scope.publicPollList.questions.splice(index, 1);
					$scope.userPollList.qCount -= 1;
				}

        $scope.publishpolls = function() {

          $scope.userPollList.title = $scope.header.title;
					$scope.userPollList.pollid = $scope.pollid;
					$scope.userPollList.owner = authUser.uid;
					$scope.userPollList.ownername = $scope.user.displayName;
          $scope.userPollList.descr = $scope.header.descr;
          userPollRef.child('polls').child($scope.pollid).set($scope.userPollList).then(
            function() {
              $scope.isPollActive = true;
            }
          );

          $scope.publicPollList.title = $scope.header.title;
					$scope.publicPollList.owner = authUser.uid;
					$scope.publicPollList.ownername = $scope.user.displayName;
          $scope.publicPollList.descr = $scope.header.descr;
					$scope.publicPollList.date = $scope.userPollList.date;
          publicPollsInfo.$add($scope.publicPollList).then(
	            function(poll){
	              console.log("Published");
								$scope.showAlert();
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

				$scope.showmodal = function(index, poll) {
					$scope.pollQues = poll;
					$scope.pollQues.editmode = true;
					$scope.pollQues.editindex = index;
					$scope.modal.show();
				}

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

				$scope.showAlert = function() {
			   var alertPopup = $ionicPopup.alert({
			     title: 'Survey Published!',
			     template: 'Survey Code: ' + $scope.pollid
			   });

			   alertPopup.then(function(res) {
			     console.log('Thank you for not eating my delicious ice cream cone');
			   });
			 };
			} //authUser
    }); //onAuthStateChanged
	}
]);
