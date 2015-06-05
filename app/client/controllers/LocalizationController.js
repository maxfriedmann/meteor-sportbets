app.controller("LocalizationController", [ "$scope", "$routeParams", "autorun", "Restangular", "$modal", "$location", function($scope, $routeParams, autorun, Restangular, $modal, $location)
{
	GAnalytics.pageview("/developer/localization");
	
	$scope.i18n = i18n;
	$scope.openligadbI18n = openligadbI18n;
	
	$scope.language = {};
	
	$scope.editMode = false;
	
	$scope.applyLanguage = function()
	{
		i18n.map($scope.currentLanguage, JSON.parse($scope.language.newOne));
		GAnalytics.event("user", "localization", appliedTempLanguage);
	};
	
	autorun($scope, function()
	{
		$scope.currentLanguage = i18n.getLanguage();
		$scope.currentMap = i18n.printMap($scope.currentLanguage);
		
		if ($scope.currentMap)
		{
			// adding missings
			var missing = 0;
			var available = 0;
			var reference = i18n.printMap("en");
			for ( var key in reference)
			{
				available++;
				if (!(key in $scope.currentMap))
				{
					missing++;
					$scope.currentMap[key] = "<MISSING>  //" + reference[key];
				}
			}
			
			$scope.translationStatus = (available - missing) + "/" + available;
			
			$scope.languageString = JSON.stringify($scope.currentMap, true, 2);
			$scope.language.newOne = $scope.languageString;
		}
	});
} ]);
