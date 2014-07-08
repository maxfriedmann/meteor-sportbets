app.controller("InfoController", [ "$scope", "autorun", "info", function($scope, autorun, info)
{
	$scope.info = info;
	
	if (info.ok == undefined)
		info.ok = "Ok";
	
} ]);
