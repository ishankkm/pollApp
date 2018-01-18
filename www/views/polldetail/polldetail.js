pollApp.controller('PolldetailController', [
	'$scope',
	'$http',
	'$firebaseAuth', '$firebaseObject',
	'$state',
	function($scope, $http, $firebaseAuth, $firebaseObject, $state) {

		var ref = firebase.database().ref();
		var auth = $firebaseAuth();

		var publicPolls = ref.child('polls').child($state.params.pId);

		auth.$onAuthStateChanged(function(authUser) {

			if(authUser) {

				publicPolls.once("value",

					function(snapshot) {
						if (snapshot.val() != null) {

							var pollKeys = Object.keys(snapshot.val());
							$scope.poll = snapshot.val()[pollKeys[0]];

						} else {
							console.log(snapshot.val() == null)
						}
					},

					function(err){
						console.log(err);
					}
				)
      		} //authUser
    	}); //onAuthStateChanged
	}
]);
