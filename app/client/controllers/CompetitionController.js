app.controller("CompetitionController", ["$scope", "$routeParams", "autorun", "Restangular", "$modal", "$location", function ($scope, $routeParams, autorun, Restangular, $modal, $location)
	{
		GAnalytics.pageview("/competition/" + $routeParams.competitionName);

		// pass through services
		$scope.i18n = i18n;
		$scope.openligadbI18n = openligadbI18n;

		// default view variables
		$scope.competition = {};
		$scope.selectedGroup = undefined;
		$scope.groups = [];
		$scope.lastGroupId = "none";
		$scope.matchesLoaded = 20;
		$scope.matchesPerPage = 5;
		$scope.matches = undefined;
		$scope.loadingStatus = undefined;
		$scope.showUpdateButton = false;
		$scope.showEditButton = false;
		$scope.manualResultActivated = false;
		$scope.manualResults = [];
		$scope.bets = [];
		$scope.facebookSharingPossible = false;

		// subscriptions
		if ($routeParams.competitionName != undefined) {
			GlobalSubsManager.subscribe("competitionByName", $routeParams.competitionName);
		}

		$scope.updateSelectedGroup = function (selectedGroup) {
			// exceptions for special groups
			switch (selectedGroup.group_name) {
			case "allmatches":
				$location.path("competitions/" + $scope.competition.name);
				break;
			case "upcomingmatches":
				$location.path("competitions/" + $scope.competition.name + '/groups/special-' + selectedGroup.group_name);
				break;

			default:
				$location.path("competitions/" + $scope.competition.name + '/groups/' + selectedGroup.group_id + "-" + openligadbI18n(selectedGroup.group_name).replace(/ /g, "_").replace(/-/g, "_"));
			}

		};

		$scope.displayGroupName = function (groupId) {
			if (groupId !== $scope.lastGroupId) {
				$scope.lastGroupId = groupId;
				return true;
			}
			return false;
		};

		$scope.updateCompetition = function (competition) {
			Meteor.call("doOLDBUpdateForCompetition", $scope.competition._id, function (error, result) {
				if (error)
					alert(error);
			});
		};
		$scope.startCompetition = function (competition) {
			Meteor.call("startManualCompetition", $scope.competition._id, function (error, result) {
				if (error)
					alert(error);
			});
		};
		$scope.restartCompetition = function (competition) {
			Meteor.call("restartManualCompetition", $scope.competition._id, function (error, result) {
				if (error)
					alert(error);
			});
		};

		$scope.updatePoints = function (competition) {
			Meteor.call("updatePoints", $scope.competition._id, function (error, result) {
				if (error)
					alert(error);
			});
		};

		$scope.loadMatches = function (start, limit) {
			$scope.loadingStatus = "Loading more matches...";
			if ($scope.competition) {
				if ($scope.selectedGroup == undefined) {
					$scope.matches = Matches.find({
						"competitionId": $scope.competition._id
					}, {
						sort: {
							match_date_time_utc: 1,
							group_order_id: 1,
							orderId : 1
						},
						limit: limit
					}).fetch();
				} else if ($scope.selectedGroup.group_name == "upcomingmatches") {
					var finishedMatchesCount = Matches.find({
						"competitionId": $scope.competition._id,
						"match_is_finished": true
					}, {
						sort: {
							match_date_time_utc: 1,
							orderId : 1
						}
					}).count();

					var skip = finishedMatchesCount - 5;

					$scope.matches = Matches.find({
						"competitionId": $scope.competition._id
					}, {
						sort: {
							match_date_time_utc: 1,
							orderId : 1
						},
						skip: skip,
						limit: 15
					}).fetch();
				} else {
					$scope.matches = Matches.find({
						"competitionId": $scope.competition._id,
						"group_id": $scope.selectedGroup.group_id
					}, {
						sort: {
							match_date_time_utc: 1,
							orderId : 1
						},
						limit: limit
					}).fetch();
				}
				//			console.log("matches loaded : ", $scope.matches);
			}
			$scope.loadingStatus = undefined;
		};

		$scope.loadMore = function () {
			$scope.matchesLoaded += $scope.matchesPerPage;
			$scope.loadMatches(0, $scope.matchesLoaded);
		};

		$scope.placeDeltaBet = function (match, homeDelta, awayDelta) {
			// GAnalytics.event("user", "placebet",
			// $scope.match.name_team1
			// + "|" + $scope.match.name_team2);

			$scope.progressComponent("bet-area-" + match._id, true);

			BetService.placeDeltaBet(match._id, match.competitionId, parseInt(homeDelta), parseInt(awayDelta), function (error, result) {
				if (error) {
					$scope.error = i18n("errors.couldnotplacebet") + " : " + error.message;

					// maybe we're on another screen, so we have to show
					// a modal
					// error here
					if (!$scope.$close) {
						$modal.open({
							templateUrl: "/templates/error.html",
							controller: "ErrorController",
							resolve: {
								"error": function () {
									return new Meteor.Error(403, i18n("errors.couldnotplacebet"), error);
								}
							}
						});
					}
				} else {
					console.log("return code : " + result);
				}
				$scope.progressComponent("bet-area-" + match._id, false);
			});
		};

		$scope.postOnFacebook = function (competition, match, bet) {
			FacebookService.postOnFacebook(competition, match, bet);
		};

		$scope.activateManualResult = function (matchId) {
			$scope.manualResults[matchId] = {
				home: 0,
				away: 0
			};
			$scope.manualResultActivated = false;
			$scope.manualResultActivated = true;
		};

		$scope.updateMatchManually = function (match_id) {
			Meteor.call("updateMatchManually", match_id, parseInt($scope.manualResults[match_id].home), parseInt($scope.manualResults[match_id].away), function (error) {
				if (error)
					Log.popup.error(error);
				$scope.manualResultActivated = false;
				$scope.$apply();
			});
		};

		autorun($scope, function () {
			// get competition
			$scope.competition = Competitions.findOne({
				name: $routeParams.competitionName
			});

			if ($scope.competition != null) {
				GlobalSubsManager.subscribe("betsForCompetitionIdAndPlayerId", $scope.competition._id, Meteor.userId());
				GlobalSubsManager.subscribe("matchesForCompetitionId", $scope.competition._id);

				// fill groups
				$scope.groups = [];
				$scope.groups.push({
					"group_name": "allmatches"
				});
				$scope.groups.push({
					"group_name": "upcomingmatches"
				});
				$scope.groups = $scope.groups.concat($scope.competition.groups);

				// get selected group
				if ($routeParams.groupId !== undefined && $scope.competition.groups !== undefined) {
					_.each($scope.groups, function (group) {
						if (group.group_id == $routeParams.groupId || (group.group_id == undefined && group.group_name == $routeParams.groupName)) {
							$scope.selectedGroup = group;
						}
					});
				}

				$scope.isAdministrator = isAdministrator();

				$scope.showUpdateButton = isAdministrator() && $scope.competition.openligadb != undefined;
				$scope.showEditButton = $scope.competition.owner === Meteor.userId();

				// get matches
				$scope.loadMatches(0, $scope.matchesLoaded);

				if ($routeParams.betGroupId != undefined) {
					$scope.betGroup = BetGroups.findOne({
						_id: $routeParams.betGroupId
					});
				} else {
					$scope.betGroup = undefined;
				}

				// get bets
				Bets.find({
					"competitionId": $scope.competition._id,
					"owner": Meteor.userId()
				}).forEach(function (bet) {
					if (bet == undefined) {
						bet = {
							homegoals: null,
							awaygoals: null
						};
					}
					$scope.bets[bet.matchId] = bet;
				});

				// get bet groups
				$scope.betGroups = [];
				$scope.betGroups.push({
					name: "== Global ==",
					_id: -1
				});
				$scope.betGroups = $scope.betGroups.concat($scope.competition.getBetGroups());
				$scope.showjoinbutton = Meteor.user() != undefined && $scope.betGroup != undefined && $scope.betGroup.players != undefined && !_.contains($scope.betGroup.players, Meteor.userId());
			}
		});

}]);