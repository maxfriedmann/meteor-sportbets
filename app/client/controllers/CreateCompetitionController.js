app.controller("CreateCompetitionController", ["$scope", "$location", "autorun", function ($scope, $location, autorun) {
	GAnalytics.pageview("/createCompetition");

	$scope.newCompetition = {};


	$scope.createCompetition = function () {
		Meteor.call("createCompetition", $scope.newCompetition.id,  $scope.newCompetition.name, $scope.newCompetition.type, function (error) {
			if (error) Log.popup.error(error.error);
			else {
				$location.path("/competitions/" + $scope.newCompetition.id);
				$scope.$apply();
			}
		});
	}

}]);
