app.directive('competitionnavigation', [ "$modal", function($modal)
{
	return {
		restrict : 'E',
		transclude : false,
		controller : [ "$scope", "$routeParams", "$route", "autorun","$location", function($scope, $routeParams, $route, autorun,$location)
		{
			$scope.getButtonClass = function(id)
			{
				switch (id)
				{
					case "matches":
						return "btn-primary";
						
					default:
						return "btn-default";
				}
			};
			
			$scope.gotoPath = function(path)
			{
				$location.path("/competitions/" + $routeParams.competitionId + path);
			};
			
			$scope.updateCompetition = function(competition)
			{
				Meteor.call("updateCompetition", competition._id);
			};
		} ],
		templateUrl : '/templates/competitionNavigation.html',
		replace : true
	};
} ]);
