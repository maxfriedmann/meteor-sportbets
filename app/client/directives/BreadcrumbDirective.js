app.directive('breadcrumb', ["$modal", function ($modal) {
	return {
		restrict: 'E',
		transclude: false,
		controller: ["$scope", "$routeParams", "$route", "autorun", function ($scope, $routeParams, $route, autorun) {
			autorun($scope, function () {
				$scope.breadcrumbs = [];

				$scope.breadcrumbs.push({
					"label": i18n("breadcrumb.home"),
					"url": "/"
				});

				if ($route.current && $route.current.$$route && $route.current.$$route.controller == "CompetitionsController") {
					$scope.breadcrumbs.push({
						"label": i18n("breadcrumb.competitions"),
						"url": "/competitions"
					});
				}

				if ($route.current && $route.current.$$route && $route.current.$$route.controller == "AccountMergeController") {
					$scope.breadcrumbs.push({
						"label": i18n("account.merge.title"),
						"url": "/account/merge"
					});
				}

				if ($route.current && $route.current.$$route && $route.current.$$route.controller == "ProfileController") {
					$scope.breadcrumbs.push({
						"label": i18n("account.profile"),
						"url": "/account/profile"
					});
				}

				if ($route.current && $route.current.$$route && ($route.current.$$route.controller == "StatisticsController" || $route.current.$$route.controller == "StatisticsOverviewController" || $route.current.$$route.controller == "PlayerStatisticsController")) {
					$scope.breadcrumbs.push({
						"label": i18n("statistics"),
						"url": "/statistics"
					});

					if ($routeParams.teamName) {
						$scope.breadcrumbs.push({
							"label": $routeParams.teamName,
							"url": "/statistics/" + $routeParams.teamId + "-" + $routeParams.teamName
						});
					}

					if ($routeParams.playerName) {
						$scope.breadcrumbs.push({
							"label": $routeParams.playerName,
							"url": "/statistics/" + $routeParams.playerId + "-" + $routeParams.playerName
						});
					}
				}

				if ($routeParams.competitionName) {
					$scope.breadcrumbs.push({
						"label": i18n("breadcrumb.competitions"),
						"url": "/competitions"
					});
					
					// get competition
					var competition = Competitions.findOne({ name: $routeParams.competitionName });
					var competitionName = $routeParams.competitionName;
					if (competition && competition.displayName !== undefined)
						competitionName = competition.displayName;
					else
						competitionName = openligadbI18n($routeParams.competitionName);

					$scope.breadcrumbs.push({
						"label": competitionName,
						"url": "/competitions/" + $routeParams.competitionName
					});

					if ($routeParams.groupName) {
						// TODO : maybe its better to load the group again here
						// than getting a url encoded, german translation back
						// to usable
						$scope.breadcrumbs.push({
							"label": $routeParams.groupName.replace(/_/g, " "),
							"url": "/competitions/" + $routeParams.competitionName + "/groups/" + $routeParams.groupId + "-" + openligadbI18n($routeParams.groupName.replace(/_/g, " "))
						});
					}

					if ($route.current.$$route && $route.current.$$route.originalPath.indexOf('/ranking') != -1) {
						$scope.breadcrumbs.push({
							"label": i18n("breadcrumb.ranking"),
							"url": "/competitions/" + $routeParams.competitionName + "/ranking"
						});
					}
                    
                    if ($route.current.$$route && $route.current.$$route.originalPath.indexOf('/edit') != -1) {
						$scope.breadcrumbs.push({
							"label": i18n("common.edit"),
							"url": "/competitions/" + $routeParams.competitionName + "/edit"
						});
					}
				}
			});
		}],
		templateUrl: '/templates/breadcrumb.html',
		replace: true
	};
}]);
