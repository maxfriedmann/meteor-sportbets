app.controller("FlagsController", [ "$scope", "$routeParams", "autorun", function($scope, $routeParams, autorun)
{
	GAnalytics.pageview("/developer/flags");
	
	$scope.missingFlags = [];
	
	autorun($scope, function()
	{
		// get missing flags
		Matches.find({}).forEach(function(match)
		{
			if (match.getFlag(match.id_team1) == undefined)
			{
				$scope.missingFlags[String(match.id_team1)] = match.name_team1;
			}
			if (match.getFlag(match.id_team2) == undefined)
			{
				$scope.missingFlags[String(match.id_team2)] = match.name_team2;
			}
		});
	});
} ]);
