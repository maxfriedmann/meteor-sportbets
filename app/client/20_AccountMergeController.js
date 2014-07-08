app.controller("AccountMergeController", [ "$scope", "$routeParams", "autorun", function($scope, $routeParams, autorun)
{
	GAnalytics.pageview("/account/merge");
	
	$scope.i18n = i18n;
	
	// some defaults
	$scope.loggedin = false;
	$scope.successMessage = false;
	$scope.accounts = [];
	$scope.status = {};
	
	autorun($scope, function()
	{
		$scope.loggedin = Meteor.user() != null;
		
		if ($scope.loggedin)
		{
			var accountsCallback = function(error, mergedUserId)
			{
				if (error)
				{
					console.log('error', error);
				}
				
				// mergedUserId is set if a merge occured
				if (mergedUserId)
				{
					console.log('mergedUserId', mergedUserId);
					
					$scope.successMessage = "Account successfully merged!";
					
					$scope.$apply();
					
					Meteor.call('mergeItems', mergedUserId, function(error, result)
					{
						if (error)
						{
							console.log('error', error);
						}
						if (result)
						{
							console.log('result', result);
						}
					});
				}
			};
			
			// start service calls
			$scope.status = {};
			Meteor.call("serviceStatus", "twitter", function(error, success)
			{
				if (success)
				{
					$scope.status["twitter"] = true;
					$scope.$apply();
				}
			});
			Meteor.call("serviceStatus", "facebook", function(error, success)
			{
				if (success)
				{
					$scope.status["facebook"] = true;
					$scope.$apply();
				}
			});
			Meteor.call("serviceStatus", "google", function(error, success)
			{
				if (success)
				{
					$scope.status["google"] = true;
					$scope.$apply();
				}
			});
			Meteor.call("serviceStatus", "github", function(error, success)
			{
				if (success)
				{
					$scope.status["github"] = true;
					$scope.$apply();
				}
			});
			
			$scope.accounts = [];
			$scope.accounts.push({
				"name" : "Facebook",
				"icon" : "facebook sign",
				"key" : "facebook",
				"action" : function()
				{
					Meteor.signInWithFacebook({}, accountsCallback);
				}
			});
			
			$scope.accounts.push({
				"name" : "Google",
				"icon" : "google plus sign",
				"key" : "google",
				"action" : function()
				{
					Meteor.signInWithGoogle({}, accountsCallback);
				}
			});
			
			$scope.accounts.push({
				"name" : "Twitter",
				"icon" : "twitter sign",
				"key" : "twitter",
				"action" : function()
				{
					Meteor.signInWithTwitter({}, accountsCallback);
				}
			});
			
			$scope.accounts.push({
				"name" : "Github",
				"icon" : "github sign",
				"key" : "github",
				"action" : function()
				{
					Meteor.signInWithGithub({}, accountsCallback);
				}
			});
		}
	});
} ]);
