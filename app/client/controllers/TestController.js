app.controller("TestController", [ "$scope", "$routeParams", "autorun", function($scope, $routeParams, autorun)
{
	GAnalytics.pageview("/test");
	
	$scope.testresults = [];
	
	$scope.testBetCollectionSync = function()
	{
		var startTime = new Date().getTime();
		Meteor.subscribe("allBets", {
			onReady : function()
			{
				$scope.addTestResult("All Bets Collection Sync Test", true, new Date().getTime() - startTime);
				$scope.$apply();
				
			}
		});
	};
	
	$scope.testMatchesCollectionSync = function()
	{
		var startTime = new Date().getTime();
		Meteor.subscribe("allMatches", {
			onReady : function()
			{
				$scope.addTestResult("All Matches Collection Sync Test", true, new Date().getTime() - startTime);
				$scope.$apply();
			}
		});
	};
	
	$scope.addTestResult = function(title, result, time)
	{
		var styleClass = result ? "success" : "danger";
		$scope.testresults.push({
			title : title,
			result : result,
			time : time,
			css : styleClass
		});
	};
	
	$scope.testDoublePlaceBet = function()
	{
		var startTime = new Date().getTime();
		async.parallel([ function(callback)
		{
			Meteor.call("placeDeltaBet", -111, "-111", 1, 0, callback);
		}, function(callback)
		{
			Meteor.call("placeDeltaBet", -111, "-111", 0, 1, callback);
		}, function(callback)
		{
			Meteor.call("placeDeltaBet", -111, "-111", 0, 1, callback);
		} ], function(error, results)
		{
			if (error)
				console.log("error", error);
			console.log("results", results);
			
			// reload bets
			Meteor.subscribe("myBets", Meteor.userId(), {
				onReady : function()
				{
					console.log("userid", Meteor.userId());
					console.log("bets find count", Bets.find({}).count());
					$scope.addTestResult("Double Placed Bet Only Once", Bets.find({
						"owner" : Meteor.userId(),
						"matchId" : -111,
						"competitionId" : "-111"
					}).count() == 1, new Date().getTime() - startTime);
					
					var bet = Bets.findOne({
						"owner" : Meteor.userId(),
						"matchId" : -111,
						"competitionId" : "-111"
					});
					console.log("bet", bet);
					$scope.addTestResult("Double Placed Bet Correct Result", bet != undefined && bet.homegoals == 0 && bet.awaygoals == 2, new Date().getTime() - startTime);
					$scope.$apply();
					
				}
			});
		});
	};
	
	$scope.runTests = function()
	{
		$scope.testresults = [];
		Meteor.call("setupTestData", function(error, success)
		{
			$scope.testBetCollectionSync();
			$scope.testMatchesCollectionSync();
			$scope.testDoublePlaceBet();
		});
	};
	
} ]);
