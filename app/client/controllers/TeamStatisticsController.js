app.controller("TeamStatisticsController", [ "$scope", "$routeParams", "autorun", "$modal", function($scope, $routeParams, autorun, $modal)
{
	GAnalytics.pageview("/statistics");
	
	$scope.i18n = i18n;
	
	// defaults
	$scope.averagePoints = 0;
	$scope.averageGoals = 0;
	$scope.goals = [];
	$scope.history = [];
	$scope.wins = 0;
	$scope.lost = 0;
	$scope.draw = 0;
	$scope.statisticName = "";
	
	if ($routeParams.teamId != undefined)
	{
		Meteor.subscribe("allMatches", {
			onReady : function()
			{
				// defaults
				$scope.averagePoints = 0;
				$scope.averageGoals = 0;
				$scope.goals = [];
				$scope.wins = 0;
				$scope.lost = 0;
				$scope.draw = 0;
				
				$scope.statisticName = $routeParams.teamName;
				
				MatchService.getMatchesForTeam($routeParams.teamId).forEach(function(matchdata)
				{
					if (_.contains(getTeamGroupingFor(matchdata.id_team1), $routeParams.teamId) && matchdata.points_team1 != -1)
					{
						$scope.goals.push(parseInt(matchdata.points_team1));
						if (matchdata.points_team1 > matchdata.points_team2)
							$scope.wins++;
						else if (matchdata.points_team1 < matchdata.points_team2)
							$scope.lost++;
						else
							$scope.draw++;
					}
					else if (_.contains(getTeamGroupingFor(matchdata.id_team2), $routeParams.teamId) && matchdata.points_team2 != -1)
					{
						$scope.goals.push(parseInt(matchdata.points_team2));
						if (matchdata.points_team2 > matchdata.points_team1)
							$scope.wins++;
						else if (matchdata.points_team2 < matchdata.points_team1)
							$scope.lost++;
						else
							$scope.draw++;
					}
				});
				
				$scope.averageGoals = (_.reduce($scope.goals, function(first, second)
				{
					return first + second;
				}, 0) / $scope.goals.length).toFixed(2);
				
				$scope.averagePoints = ((($scope.wins * 3) + $scope.draw) / $scope.goals.length).toFixed(2);
				
				$scope.history = MatchService.getMatchesForTeam($routeParams.teamId, true, true, 10).fetch();
				
				$scope.$apply();
			}
		});
	}
	
} ]);
