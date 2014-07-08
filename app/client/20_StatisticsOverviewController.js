app.controller("StatisticsOverviewController", [ "$scope", "$routeParams", "autorun", function($scope, $routeParams, autorun)
{
	GAnalytics.pageview("/statistics/overview");
	
	$scope.i18n = i18n;
	$scope.teams = {};
	$scope.users = {};
	
	Meteor.subscribe("allMatches", {
		onReady : function()
		{
			$scope.teams = [];
			
			var allTeams = TeamService.getAllTeams(true);
			var already = [];
			Matches.find({}).forEach(function(matchdata)
			{
				if (!_.contains(already, matchdata.id_team1) && _.contains(allTeams, matchdata.id_team1))
				{
					$scope.teams.push({
						id : matchdata.id_team1,
						name : matchdata.name_team1
					});
					already.push(matchdata.id_team1);
				}
				if (!_.contains(already, matchdata.id_team2) && _.contains(allTeams, matchdata.id_team2))
				{
					$scope.teams.push({
						id : matchdata.id_team2,
						name : matchdata.name_team2
					});
					already.push(matchdata.id_team2);
				}
			});
			
			$scope.$apply();
			
			Meteor.subscribe("allUsers", {
				onReady : function()
				{
					$scope.users = Meteor.users.find({}).fetch();
					$scope.$apply();
				}
			});
			
		}
	});
	
} ]);
