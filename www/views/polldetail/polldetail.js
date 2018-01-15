pollApp.controller('PolldetailController', [
	'$scope', 
	'$http', 
	'$firebaseAuth', '$firebaseArray',
	'$state',
	function($scope, $http, $firebaseAuth, $firebaseArray, $state) {

		var ref = firebase.database().ref();
		var auth = $firebaseAuth();

		var publicPolls = ref.child('polls');
		var publicPollsInfo = $firebaseArray(publicPolls);

		auth.$onAuthStateChanged(function(authUser) {

			if(authUser) {


				publicPolls.orderByChild("pollid").equalTo($state.params.pId).once("value", 

					function(snapshot) {
						if (snapshot.val() != null) {
							var pollKeys = Object.keys(snapshot.val());
							$scope.pollQues = snapshot.val()[pollKeys[0]];
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