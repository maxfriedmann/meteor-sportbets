app.controller("ErrorController", [ "$scope", "autorun", "error", function($scope, autorun, error)
{
	$scope.error = error;
	
	$scope.resendVerificationEmail = function()
	{
		Meteor.call("resendVerificationEmail", function(verifyError, success)
		{
			if (verifyError)
			{
				$scope.error = verifyError;
			}
			else
			{
				$scope.success = success;
				$scope.$apply();
			}
		});
	};
} ]);
