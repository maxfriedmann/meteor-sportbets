app.controller("SpecialBetsController", [ "$scope", "autorun", "$routeParams", function($scope, autorun, $routeParams)
{
	GlobalSubsManager.subscribe("myPlayer");
	
	$scope.newQuestion = {};
	$scope.answers = [];
	
	// subscriptions
	if ($routeParams.competitionName != undefined)
	{
		GlobalSubsManager.subscribe("competitionByName", $routeParams.competitionName);
	}
	
	// admin functions
	$scope.addQuestion = function()
	{
		if (isAdministrator() && $scope.competition)
		{
			Meteor.call("addNewCompetitionQuestion", $scope.competition._id, $scope.newQuestion.title, $scope.newQuestion.answerType, $scope.newQuestion.answerPoints, $scope.newQuestion.duedate, StandardCallback);
		}
	};
	
	$scope.saveAnswer = function(question)
	{
		if (!$scope.answers[question._id])
			Log.popup.error("Please answer the question first!");
		else
		{
			Meteor.call("saveSpecialBet", question._id, parseInt($scope.answers[question._id]), StandardCallback);
		}
	};
	
	autorun($scope, function()
	{
		// get competition
		$scope.competition = Competitions.findOne({
			name : $routeParams.competitionName
		});
		
		if ($scope.competition)
		{
			// subscribe competition questions
			GlobalSubsManager.subscribe("competitionQuestionsByCompetitionId", $scope.competition._id);
			GlobalSubsManager.subscribe("specialBetsForPlayerId", Meteor.userId());
			GlobalSubsManager.subscribe("matchesForCompetitionId", $scope.competition._id);
			
			// get them
			$scope.competitionQuestions = CompetitionQuestions.find({
				"competitionId" : $scope.competition._id
			}).fetch();
			
			// initialize answers
			_.each($scope.competitionQuestions, function(question)
			{
				$scope.answers[question._id] = {};
			});
			
			// get the answers
			SpecialBets.find({
				owner : Meteor.userId()
			}).forEach(function(specialBet)
			{
				$scope.answers[specialBet.questionId] = specialBet.answer;
			});
			
			// get teams for this competition
			$scope.teamsForCompetition = [];
			
			Matches.find({
				competitionId : $scope.competition._id
			}).forEach(function(match)
			{
				var team1 = {
					id : parseInt(match.id_team1),
					name : openligadbI18n(match.name_team1)
				};
				var team2 = {
					id : parseInt(match.id_team2),
					name : openligadbI18n(match.name_team2)
				};
				
				if (!ArrayContainsObject($scope.teamsForCompetition, "id", match.id_team1))
				{
					$scope.teamsForCompetition.push(team1);
				}
				
				if (!ArrayContainsObject($scope.teamsForCompetition, "id", match.id_team2))
				{
					$scope.teamsForCompetition.push(team2);
				}
			});
		}
	});
} ]);
