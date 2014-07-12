RankingService = {};

RankingService.updateRankings = function(competitionId)
{
	console.log("Updating Ranking for competition ID : " + competitionId);
	// update global ranking
	var globalRanking = RankingService.rankingForCompetition(competitionId);
	Competitions.update({
		"_id" : competitionId
	}, {
		$set : {
			"ranking" : globalRanking
		}
	});
	
	// update betgroup rankins
	BetGroups.find({
		"competitionId" : competitionId
	}).forEach(function(betGroup)
	{
		var ranking = RankingService.rankingForCompetition(competitionId, betGroup._id);
		BetGroups.update({
			_id : betGroup._id
		}, {
			$set : {
				"ranking" : ranking
			}
		});
	});
	console.log("Finished updating Ranking for competition ID : " + competitionId);
};

RankingService.rankingForCompetition = function(competitionId, betGroupId)
{
	if (competitionId == undefined || !Match.test(competitionId, String))
	{
		throw new Meteor.Error(404, "No valid CompetitionId given");
	}
	if (betGroupId != undefined && !Match.test(betGroupId, String))
	{
		throw new Meteor.Error(404, "No valid betGroupId given");
	}
	
	var betGroup = undefined;
	
	if (betGroupId != undefined)
	{
		betGroup = BetGroups.findOne({
			_id : betGroupId
		});
	}
	
	// iterate over all bets for this competition
	var ranking = [];
	Bets.find({
		"competitionId" : competitionId
	}).forEach(function(bet)
	{
		if (betGroup == undefined || (betGroup != undefined && _.contains(betGroup.players, bet.owner)))
		{
			if (ranking[bet.owner] == undefined)
			{
				ranking[bet.owner] = 0;
			}
			if (bet.points != undefined)
				ranking[bet.owner] += parseInt(bet.points);
		}
	});
	
	// iterate over all competition questions
	CompetitionQuestions.find({
		"competitionId" : competitionId
	}).forEach(function(question)
	{
		// iterate over all specialbets for this competition
		SpecialBets.find({
			"questionId" : question._id
		}).forEach(function(specialbet)
		{
			if (betGroup == undefined || (betGroup != undefined && _.contains(betGroup.players, specialbet.owner)))
			{
				if (ranking[specialbet.owner] == undefined)
				{
					ranking[specialbet.owner] = 0;
				}
				if (specialbet.points != undefined)
					ranking[specialbet.owner] += parseInt(specialbet.points);
			}
		});
	});
	
	// mix ranking and user
	var rankingWithUsers = [];
	for ( var userId in ranking)
	{
		rankingWithUsers.push({
			user : Meteor.users.findOne({
				_id : userId
			}, {
				fields : {
					nickname : 1,
					"profile.picture" : 1
				}
			}),
			points : ranking[userId]
		});
	}
	
	return rankingWithUsers;
};
