app = angular.module("SportBets", ['ngRoute', 'restangular', 'ui.bootstrap', 'infinite-scroll']);

// Global Objects
GlobalSubsManager = new SubsManager();
OneTimeSubsManager = GlobalSubsManager;


(function () {

	app.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}]);

	// app.config(['$interpolateProvider',
	// 	function ($interpolateProvider) {
	// 		$interpolateProvider.startSymbol('[[');
	// 		$interpolateProvider.endSymbol(']]');
	// 	}
	// ]);

	app.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode({ enabled: true, requireBase: false }).hashPrefix('#');
	}]);

	function autorun($scope, fn) {
		setTimeout(function () {
			var comp = Tracker.autorun(function () {
				fn();
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
					$scope.$digest();
			});
			$scope.$on("$destroy", function () {
				comp.stop();
			});
		}, 0);
	}
	app.value("autorun", autorun);
})();

// Meteor.startup(function () {
// 	angular.bootstrap(document, ['SportBets']);
// });