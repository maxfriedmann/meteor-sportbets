app.controller("EditCompetitionController", ["$scope", "$location", "autorun", "$routeParams", function ($scope, $location, autorun, $routeParams) {
	GAnalytics.pageview("/createCompetition");

	$scope.competition = {
		options: {}
	};

	$scope.loading = true;



	// subscriptions
	if ($routeParams.competitionName != undefined) {
		Meteor.subscribe("competitionByName", $routeParams.competitionName, function () {
			Tracker.autorun(function () {
				$scope.competition = Competitions.findOne({
					name: $routeParams.competitionName
				});
				console.log("comp : ", $scope.competition);

				// inits
				if ($scope.competition.options === undefined)
					$scope.competition.options = {};
				if ($scope.competition.options.teamNames === undefined)
					$scope.competition.options.teamNames = [];
				if ($scope.competition.options.randomizeTeamNames === undefined)
					$scope.competition.options.randomizeTeamNames = true;

				$scope.loading = false;
				$scope.$apply();

				$('.ui.checkbox').checkbox();

			});
		});
	}


	$scope.range = function (start, end) {
		var result = [];
		for (var i = start; i <= end; i++) {
			result.push(i);
		}
		return result;
	}

	$scope.getWildcards = function () {
		if ($scope.competition.type === "manualLeague")
			return $scope.competition.options.teamCount % 2;
		if ($scope.competition.type === "manualTournament")
			return CompetitionUtils.getTournamentWildcardCount($scope.competition.options.teamCount);
		return 0;
	}

	$scope.saveCompetition = function () {
		// truncate team names, maybe count has changed
		$scope.competition.options.teamNames = _.first($scope.competition.options.teamNames, $scope.competition.options.teamCount);

		console.log("updating competition with options : ", $scope.competition.options);

		Meteor.call("updateCompetition", $scope.competition._id, $scope.competition.displayName, $scope.competition.options, $scope.competition.openligadb, function (error) {
			if (error)
				Log.popup.error(error.error);
			else
				Log.popup.success("Successfully saved competition!");
		});
	}

	$scope.updateOLDBCompetition = function (competition) {
		Meteor.call("doOLDBUpdateForCompetition", $scope.competition._id, function (error, result) {
			if (error)
				Log.popup.error(error);
		});
	};
	$scope.startCompetition = function (competition) {
		Meteor.call("startManualCompetition", $scope.competition._id, function (error, result) {
			if (error)
				Log.popup.error(error);
		});
	};
	$scope.restartCompetition = function (competition) {
		Meteor.call("restartManualCompetition", $scope.competition._id, function (error, result) {
			if (error)
				Log.popup.error(error);
		});
	};

	$scope.updatePoints = function (competition) {
		Meteor.call("updatePoints", $scope.competition._id, function (error, result) {
			if (error)
				Log.popup.error(error);
		});
	};




}]);