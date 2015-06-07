app = angular.module("SportBets", [ 'ngRoute', 'restangular', 'ui.bootstrap', 'infinite-scroll' ]);

// Global Objects
GlobalSubsManager = new SubsManager();
OneTimeSubsManager = GlobalSubsManager;

app.config([ '$httpProvider', function($httpProvider)
{
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
} ]);

app.config([ '$locationProvider', function($locationProvider)
{
	$locationProvider.html5Mode(true).hashPrefix('');
} ]);

app.factory('autorun', function()
{
	return function(scope, fn)
	{
		// wrapping around Deps.autorun
		var comp = Deps.autorun(function(c)
		{
			fn(c);
			
			// this is run immediately for the first call
			// but after that, we need to $apply to start Angular digest
			if (!c.firstRun)
				setTimeout(function()
				{
					// wrap $apply in setTimeout to avoid conflict with
					// other digest cycles
					scope.$apply();
				}, 0);
		});
		// stop autorun when scope is destroyed
		scope.$on('$destroy', function()
		{
			comp.stop();
		});
		// return autorun object so that it can be stopped manually
		return comp;
	};
});
