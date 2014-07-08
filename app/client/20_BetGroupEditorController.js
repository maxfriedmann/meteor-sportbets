app.controller("BetGroupEditorController", [ "$scope", "autorun", "$routeParams", function($scope, autorun, $routeParams)
{
	GAnalytics.pageview("/betgroups/edit");
	
	$scope.group = {};
	
	$scope.save = function()
	{
		// update
		if ($routeParams.betGroupId != undefined)
		{
			Meteor.call("updateBetGroup", $scope.group._id, $scope.group.name, $scope.group.description, $scope.group.prices, function(error, success)
			{
				if (error)
				{
					Log.popup.error(error);
				}
				else
					Log.popup.info("Bet Group successfully saved!");
			});
		}
		// new
		else
		{
			if ($scope.forCompetition == undefined)
			{
				Log.popup.error("Please select a competition the bet group should be for!");
			}
			else
			{
				Meteor.call("newBetGroup", $scope.group.name, $scope.group.description, $scope.group.prices, $scope.forCompetition._id, function(error, success)
				{
					if (error)
					{
						Log.popup.error(error);
					}
					else
					{
						// TODO : fix this
						Log.popup.success("Bet Group successfully created!");
						// $scope.group = success;
						// $scope.id = success._id;
						// $scope.createMode = false;
						// $scope.$apply();
					}
				});
			}
		}
	};
	
	$scope.cancel = function()
	{
		console.log("cancel called");
	};
	
	autorun($scope, function()
	{
		$scope.competitions = Competitions.find({}).fetch();
		
		if ($routeParams.betGroupId != undefined)
		{
			console.log("$routeParams.betGroupId", $routeParams.betGroupId);
			$scope.createMode = false;
			BetGroups.findOne({
				"_id" : $routeParams.betGroupId,
				"owner" : Meteor.userId()
			});
			
			if ($scope.betGroup == undefined)
			{
				Log.popup.error("Could not load bet group for editing, maybe you're not the owner?");
			}
		}
		else
		{
			$scope.createMode = true;
		}
	});
	
} ]);
