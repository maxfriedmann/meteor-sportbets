app.controller("RankingController", [ "$scope", "$routeParams", "autorun", "Restangular", "$modal", "$location", function($scope, $routeParams, autorun, Restangular, $modal, $location)
{
	GAnalytics.pageview("/competition/" + $routeParams.competitionName + "/ranking");
	
	$scope.ranking = undefined;
	$scope.competition = undefined;
	
	$scope.onlineUsers = [];
	
	$scope.lastRankPoints = -1;
	$scope.i18n = i18n;
	$scope.openligadbI18n = openligadbI18n;
	
	$scope.betGroups = [];
	$scope.betGroup = {};
	
	GlobalSubsManager.subscribe("onlineUsers");
	
	if ($routeParams.competitionName != undefined)
	{
		GlobalSubsManager.subscribe("competitionByName", $routeParams.competitionName);
	}
	
	autorun($scope, function()
	{
		$scope.competition = Competitions.findOne({
			name : $routeParams.competitionName
		}, {
			fields : {
				_id : 1,
				name : 1,
				ranking : 1
			}
		});
		
		if ($scope.competition)
		{
			// get the online users

			Meteor.users.find({}).forEach(function(user)
			{
				$scope.onlineUsers[user._id] = user.profile.online;
			});
			
			GlobalSubsManager.subscribe("betGroupsForCompetitionId", $scope.competition._id);
			if ($routeParams.betGroupId != undefined)
			{
				$scope.betGroup = BetGroups.findOne({
					_id : $routeParams.betGroupId
				});
				
				if ($scope.betGroup)
				{
					$scope.ranking = $scope.betGroup.ranking;
				}
			}
			else
			{
				$scope.betGroup = undefined;
				$scope.ranking = $scope.competition.ranking;
			}
			
			// get bet groups
			$scope.betGroups = [];
			$scope.betGroups.push({
				name : "== Global ==",
				_id : -1
			});
			$scope.betGroups = $scope.betGroups.concat($scope.competition.getBetGroups());
			$scope.showjoinbutton = Meteor.user() != undefined && $scope.betGroup != undefined && $scope.betGroup.players != undefined && !_.contains($scope.betGroup.players, Meteor.userId());
			
		}
	});
	
	$scope.samePointsAsLastPosition = function(points)
	{
		if (points == $scope.lastRankPoints)
			return true;
		$scope.lastRankPoints = points;
	};
	
	$scope.updateSelectedBetGroup = function(betGroup)
	{
		if (betGroup._id == -1)
			$location.path("competitions/" + $scope.competition.name + '/ranking');
		else
			$location.path("competitions/" + $scope.competition.name + '/ranking/betgroups/' + betGroup._id);
	};
	
	$scope.inviteUsers = function()
	{
		$modal.open({
			templateUrl : "/templates/url.html",
			controller : "InfoController",
			size : "lg",
			resolve : {
				"info" : function()
				{
					return {
						title : "Bet Group Invitation",
						content : "To invite your friends please copy this URL and forward it!",
						url : $location.absUrl(),
						ok : "Ok"
					};
				}
			}
		});
	};
	
	$scope.joinBetGroup = function()
	{
		Meteor.call("joinBetGroup", $scope.betGroup._id, function(error, success)
		{
			if (error)
				Log.popup.error(error);
			else
				Log.popup.success(success);
		});
	};
	
} ]);
