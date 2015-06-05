app.controller("ProfileController", [ "$scope", "$routeParams", "autorun", function($scope, $routeParams, autorun)
{
	GAnalytics.pageview("/account/profile");
	
	$scope.i18n = i18n;
	
	$scope.dirty = false;
	$scope.account = {};
	
	$scope.avatars = Avatars;
	
	$scope.saveAccount = function()
	{
		if (Meteor.user())
		{
			// nickname
			if ($scope.account.nickname.length >= 3)
			{
				Meteor.call("updateProfile", $scope.account.nickname, $scope.account.profilePicture, function(error, success)
				{
					if (error)
						alert(error);
					else
					{
						if ($scope.accountForm)
							$scope.accountForm.$setPristine();
						$scope.dirty = false;
						Log.popup.success("Profile saved!");
					}
				});
			}
			else
			{
				Log.popup.error("Nickname must be longer than 2 letters");
			}
		}
		else
			Log.popup.error("You should be logged in to save your profile!");
	};
	
	$scope.randomAvatar = function()
	{
		$scope.account.profilePicture = "/images/avatars/" + _.sample(Avatars);
		$scope.dirty = true;
	};
	
	$scope.useFacebook = function()
	{
		$scope.account.profilePicture = "http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture/?type=large";
		$scope.dirty = true;
	};
	
	$scope.restore = function()
	{
		$scope.account.nickname = Meteor.user().nickname;
		$scope.account.profilePicture = Meteor.user().profile.picture;
		if ($scope.account.profilePicture == undefined)
		{
			$scope.account.profilePicture = "/images/avatars/contractor_128.png";
		}
		
		if ($scope.accountForm)
			$scope.accountForm.$setPristine();
	};
	
	autorun($scope, function()
	{
		if (Meteor.user() != null)
		{
			$scope.restore();
			$scope.facebookEnabled = Meteor.user().services && Meteor.user().services.facebook && Meteor.user().services.facebook.id;
		}
	});
	
} ]);
