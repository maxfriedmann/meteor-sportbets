BetService = {};

BetService.isBetable = function(bet)
{
	if (!(bet instanceof Bet))
		return false;
	
	return true;
};

BetService.placeDeltaBet = function(matchId, competitionId, deltaHomeGoals, deltaAwayGoals, callback)
{
	Meteor.call("placeDeltaBet", matchId, competitionId, parseInt(deltaHomeGoals), parseInt(deltaAwayGoals), callback);
};

BetService.getBetForMatchdata = function(matchdata)
{
	// return Bets.findOne({
	// 	"owner" : Meteor.userId(),
	// 	"matchId" : matchdata.match_id
	// });
	throw new Meteor.Error("deprecated");
};

BetService.updatePointsForMatch = function(match)
{

	// update bet points
	if (match.isFinished())
	{
		Bets.find({
			"matchId" : match._id
		}).forEach(function(bet)
		{
			var points = BetService.getPoints(bet, match);
			if (points != undefined)
			{
				Bets.update({
					_id : bet._id
				}, {
					$set : {
						"points" : points,
						"match_is_finished" : true
					}
				});
			}
		});
	}
};

BetService.getPointsPerPlayerAndCompetition = function(playerId, competitionId)
{
	var points = 0;
	Bets.find({
		"competitionId" : competitionId,
		"owner" : playerId
	}).forEach(function(bet)
	{
		points += bet.points;
	});
	
	return points;
};

BetService.getPoints = function(bet, matchdata)
{
	debugger;
	if (matchdata && bet)
	{
		if (matchdata.multiplier == undefined)
		{
			console.log("WARNING : No multiplier found for game : " + matchdata.name_team1 + " vs. " + matchdata.name_team2);
			matchdata.multiplier = 1;
		}
		
		// check if bet is properly placed
		if (bet.homegoals == undefined || bet.homegoals == null || bet.awaygoals == undefined || bet.awaygoals == null)
			return 0;
		
		// check if matchdata is good
		if (matchdata.points_team1 == undefined || matchdata.points_team1 < 0 || matchdata.points_team2 == undefined || matchdata.points_team1 < 0)
			return 0;
		
		// everything equal
		if (bet.homegoals == matchdata.points_team1 && bet.awaygoals == matchdata.points_team2)
		{
			return 3 * matchdata.multiplier;
		}
		
		// tendenz richtig
		if (bet.homegoals - bet.awaygoals == matchdata.points_team1 - matchdata.points_team2)
		{
			return 2 * matchdata.multiplier;
		}
		
		// right winner
		if ((bet.homegoals > bet.awaygoals && matchdata.points_team1 > matchdata.points_team2) || (bet.homegoals < bet.awaygoals && matchdata.points_team1 < matchdata.points_team2))
		{
			return 1 * matchdata.multiplier;
		}
		
		return 0;
	}
	return undefined;
};
