app.config([ '$routeProvider', function($routeProvider)
{
	// HOME
	$routeProvider.otherwise({
		templateUrl : '/templates/home.html',
		controller : 'HomeController'
	});
	
	// COMPETITIONS
	$routeProvider.when("/competitions", {
		templateUrl : '/templates/competitions.html',
		controller : 'CompetitionsController'
	});

	$routeProvider.when("/createCompetition", {
		templateUrl : '/templates/createCompetition.html',
		controller : 'CreateCompetitionController'
	});
	
	// COMPETITION matches
	$routeProvider.when('/competitions/:competitionName', {
		templateUrl : "/templates/competition.html",
		controller : 'CompetitionController',
		resolve : {
			detailPage : function()
			{
				return "matches";
			}
		}
	});
	
	// COMPETITION group + matches
	$routeProvider.when('/competitions/:competitionName/groups/:groupId-:groupName?', {
		templateUrl : "/templates/competition.html",
		controller : 'CompetitionController'
	});
	
	// COMPETITION ranking
	$routeProvider.when('/competitions/:competitionName/ranking', {
		templateUrl : "/templates/ranking.html",
		controller : 'RankingController'
	});
	
	$routeProvider.when('/competitions/:competitionName/ranking/betgroups/:betGroupId', {
		templateUrl : "/templates/ranking.html",
		controller : 'RankingController'
	});
	
	// COMPETITION special bets
	$routeProvider.when('/competitions/:competitionName/specialbets', {
		templateUrl : "/templates/specialBets.html",
		controller : 'SpecialBetsController'
	});
	
	// DEVELOPER
	$routeProvider.when('/developer/flags', {
		templateUrl : "/templates/flags.html",
		controller : 'FlagsController'
	});
	
	$routeProvider.when('/developer/localization', {
		templateUrl : "/templates/localization.html",
		controller : 'LocalizationController'
	});
	
	// ACCOUNT
	$routeProvider.when('/account/merge', {
		templateUrl : "/templates/accountMerge.html",
		controller : 'AccountMergeController'
	});
	
	$routeProvider.when('/account/profile', {
		templateUrl : "/templates/profile.html",
		controller : 'ProfileController'
	});
	
	// STATISTICS
	$routeProvider.when('/statistics/teams/:teamId-:teamName?', {
		templateUrl : "/templates/teamStatistics.html",
		controller : "TeamStatisticsController"
	});
	
	$routeProvider.when('/statistics/players/:playerId-:playerName?', {
		templateUrl : "/templates/playerStatistics.html",
		controller : "PlayerStatisticsController"
	});
	
	$routeProvider.when('/statistics', {
		templateUrl : "/templates/statisticsOverview.html",
		controller : "StatisticsOverviewController"
	});
	
	// BET GROUPS
	
	$routeProvider.when('/betgroups/new/:forCompetitionId?', {
		templateUrl : "/templates/editBetGroup.html",
		controller : "BetGroupEditorController"
	});
	
	$routeProvider.when('/betgroups/:betGroupId/edit', {
		templateUrl : "/templates/editBetGroup.html",
		controller : "BetGroupEditorController"
	});
	
	$routeProvider.when('/betgroups/:betGroupId/addplayer/:addPlayerId', {
		templateUrl : "/templates/addBetGroup.html",
		controller : "BetGroupAddController"
	});
	
	// ABOUT
	$routeProvider.when('/about', {
		templateUrl : "/templates/about.html"
	});
	
	// TEST
	$routeProvider.when('/test', {
		templateUrl : "/templates/test.html",
		controller : "TestController"
	});
	$routeProvider.when('/test/setup', {
		templateUrl : "/templates/testsetup.html",
		controller : "TestSetupController"
	});
	
	// ADMIN
	$routeProvider.when('/admin', {
		templateUrl : "/templates/admin.html",
		controller : "AdministrationController"
	});
	
} ]);
