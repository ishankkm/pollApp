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
							$scope.resAgg = buildAggregates($scope.poll);
						} else {
							console.log(snapshot.val() == null)
						}
					},
					function(err){
						console.log(err);
					}
				) // publicPolls.once
  		} //authUser
		}); //onAuthStateChanged
	} // function
]); // controller

function buildAggregates(poll) {
	aggDict = {}

	poll.questions.forEach(function (ques) {
		aggDict[ques.qid] = {}
		Object.keys(ques.options).forEach(function(op) {
			aggDict[ques.qid][op] = 0;
		});
		aggDict[ques.qid]['totalRes'] = 0;
	});

	if (poll.responses) {
		Object.keys(poll.responses).forEach(function (res) {
				poll.responses[res].forEach(function(q) {
					aggDict[q.qid][q.ans] += 1;
					aggDict[q.qid]['totalRes'] += 1
				});
		});
	}

	Object.keys(aggDict).forEach(function (res) {
			labels =  Object.keys(aggDict[res]).slice(0, -1);

			aggDict[res]['data'] = [];

			labels.forEach(function(l) {
				if (aggDict[res]['totalRes'] != 0) {
					aggDict[res]['data'].push( 100 * aggDict[res][l] / aggDict[res]['totalRes'] );
				} else {
					aggDict[res]['data'].push(0);
				}
			});
	});

	poll.questions.forEach(function (ques) {
		aggDict[ques.qid]['labels'] = []
		Object.keys(ques.options).forEach(function(op) {
			aggDict[ques.qid]['labels'].push(ques.options[op]);
		});
	});

	aggDict['options'] = {
		scales: {
			xAxes: [{
				type: 'linear',
				position: 'bottom',
				ticks: {
					max: 100
				}
			}],
			yAxes: [{
				categoryPercentage: 0.7,
				barPercentage: 0.9,
			}]
		},
		elements: {
				rectangle: {
						borderWidth: 2,
						borderColor: 'rgb(132, 132, 132)',
						borderSkipped: 'left'
				}
		},
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					return tooltipItem.xLabel + '%'
				}
			}
		}
	}

	aggDict['colors'] = [ '#fac364', '#52bacc', '#f99494', '#71c989', '#FDB45C', '#4D5360']
	// console.log(aggDict);
	return aggDict;
}
