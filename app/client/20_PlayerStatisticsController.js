app.controller("PlayerStatisticsController", [ "$scope", "$routeParams", "autorun", function($scope, $routeParams, autorun)
{
	GAnalytics.pageview("/statistics/player");
	
	$scope.i18n = i18n;
	
	// defaults
	$scope.averagePoints = 0;
	$scope.averageGoals = 0;
	$scope.wins = 0;
	$scope.lost = 0;
	$scope.draw = 0;
	
	$scope.pointCategories = [];
	
	if ($routeParams.playerId)
	{
		GlobalSubsManager.subscribe("player", $routeParams.playerId);
		GlobalSubsManager.subscribe("allMatches");
		GlobalSubsManager.subscribe("myBets", $routeParams.playerId);
	}
	
	autorun($scope, function()
	{
		$scope.player = Meteor.users.findOne({
			"_id" : String($routeParams.playerId)
		});
		
		// defaults
		$scope.averagePoints = 0;
		$scope.averageGoals = 0;
		$scope.points = 0;
		
		$scope.pointCategories = [];
		$scope.pointCategories["0"] = 0;
		$scope.pointCategories["1_1"] = 0;
		$scope.pointCategories["2_1"] = 0;
		$scope.pointCategories["2_2"] = 0;
		$scope.pointCategories["3_1"] = 0;
		$scope.pointCategories["4_2"] = 0;
		$scope.pointCategories["6_2"] = 0;
		
		if ($scope.player != undefined)
		{
			$scope.placedBets = Bets.find({
				owner : $scope.player._id
			}).count();
			
			$scope.finishedBets = 0;
			
			Bets.find({
				"owner" : $scope.player._id
			}).forEach(function(bet)
			{
				var matchdata = Matches.findOne({
					"match_id" : String(bet.matchId)
				});
				if (matchdata && matchdata.match_is_finished)
				{
					$scope.finishedBets++;
					var points = bet.points;
					if (points != undefined)
					{
						$scope.points += points;
						if (points > 0)
							$scope.pointCategories[points + "_" + matchdata.multiplier]++;
						else
							$scope.pointCategories["0"]++;
					}
				}
			});
			
			if ($scope.finishedBets > 0)
				$scope.averagePoints = ($scope.points / $scope.finishedBets).toFixed(2);
		}
	});
	
} ]);
