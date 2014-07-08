app.controller("TestSetupController", [ "$scope", "$routeParams", "autorun",
		function($scope, $routeParams, autorun) {

			Meteor.call("setupTestData", StandardCallback);

		} ]);
