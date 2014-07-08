app.controller("HomeController", [ "$scope", "autorun", "$location", function($scope, autorun, $location)
{
	GAnalytics.pageview("/home");
	
	$scope.i18n = i18n;
	$scope.openligadbI18n = openligadbI18n;
	
	$scope.moment = moment;
	
	$scope.news = [];
	
	$scope.newNews = {};
	
	GlobalSubsManager.subscribe("lastTenNews");
	
	$scope.submitNews = function()
	{
		Meteor.call("submitNews", $scope.newNews.type, $scope.newNews.text, function(error, success)
		{
			if (error)
				Log.popup.error("Could not submit news : " + error);
			else
				Log.popup.success("Successfully added news entry!");
		});
	};
	
	autorun($scope, function()
	{
		$scope.isAdministrator = isAdministrator();
		
		$scope.news = News.find({}, {
			sort : {
				date : -1
			}
		}).fetch();
	});
	
} ]);
