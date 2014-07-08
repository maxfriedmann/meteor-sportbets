app.controller("BetGroupAddController", [ "$scope", "autorun", "$routeParams", function($scope, autorun, $routeParams)
{
	GAnalytics.pageview("/betgroups/add");
	
	$scope.success = false;
	
	autorun($scope, function()
	{
		if (!$scope.success && $routeParams.addPlayerId != undefined && $routeParams.betGroupId != undefined && Meteor.user() != undefined)
		{
			Meteor.call("addToBetGroup", $routeParams.addPlayerId, $routeParams.betGroupId, function(error, success)
			{
				if (error)
					Log.popup.error(error);
				else
				{
					// to prevent a reload with a 'user already in group' error
					// message
					$scope.success = true;
					$scope.$apply();
				}
			});
		}
	});
} ]);
