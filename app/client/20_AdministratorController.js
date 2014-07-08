app.controller("AdministrationController", [ "$scope", "$routeParams", "autorun", function($scope, $routeParams, autorun)
{
	GAnalytics.pageview("/admin");
	
	$scope.emails = [];
	
	$scope.loadEmails = function()
	{
		if (isAdministrator())
		{
			Meteor.call("getMails", function(error, success)
			{
				console.log("success", success);
				if (error)
					alert(error);
				else
				{
					$scope.emails = success;
					$scope.$apply();
				}
			});
		}
		else
		{
			alert("You're not an admin dude!");
		}
	};
	
	$scope.getDoubledMatches = function()
	{
		Meteor.call("getDoubledMatches", function(error, success)
		{
			if (error)
				alert(error);
			else
			{
				$scope.doubledMatches = success;
				$scope.$apply();
			}
		});
	};
	
	$scope.getDoubledBets = function()
	{
		$scope.progressComponent("doubledBetsProgress", true);
		Meteor.call("getDoubledBets", function(error, success)
		{
			if (error)
				alert(error);
			else
			{
				$scope.doubledBets = success;
				$scope.$apply();
			}
			$scope.progressComponent("doubledBetsProgress", false);
		});
	};
	
	$scope.fixDoubledBets = function()
	{
		Meteor.call("fixDoubledBets", function(error, success)
		{
			if (error)
				alert(error);
		});
	};
} ]);
