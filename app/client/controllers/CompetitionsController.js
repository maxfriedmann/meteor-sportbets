app.controller("CompetitionsController", ["$scope", "$location", "autorun", function ($scope, $location, autorun) {
	GAnalytics.pageview("/competitions");

	$scope.competitionsLoaded = false;
	Tracker.autorun(function () {
		$scope.showCreateCompetitionLink = Meteor.userId() !== null;
	});
	$scope.competitions = [];
	$scope.i18n = i18n;
	$scope.openligadbI18n = openligadbI18n;

	Meteor.subscribe("allCompetitions", function () {
		$scope.competitions = Competitions.find({}, {
			sort: {
				orderId: -1
			}
		}).fetch();
		if ($scope.competitions.length != 0) {
			Meteor.call("competitionsWithStatistics", function (error, success) {
				if (error)
					Log.popup.error(error);
				else
					$scope.competitions = success;
				$scope.$apply();
			});
		};
		$scope.competitionsLoaded = true;
		$scope.$apply();
	});

	$scope.createCompetition = function () {
		$location.path("createCompetition");
	}

}]);