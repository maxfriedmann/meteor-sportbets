Meteor.methods({
	updateCompetition : function(competitionId)
	{
		if (isAdministrator())
		{
			check(competitionId, String);
			console.log("Getting Competition by ID : " + competitionId);
			
			// clearing update flag
			Competitions.update({
				"_id" : competitionId
			}, {
				$unset : {
					"openligadb.last_change_date" : 1
				}
			});
			
			OpenLigaDBService.updateCompetition(competitionId);
			RankingService.updateRankings(competitionId);
		}
		else
		{
			throw new Meteor.Error(403, "You're not an administrator!");
		}
	},
	updatePoints : function(competitionId)
	{
		if (isAdministrator())
		{
			check(competitionId, String);
			
			Matches.find({
				"competitionId" : competitionId
			}).forEach(function(match)
			{
				BetService.updatePointsForMatch(match);
			});
		}
		return true;
	}
});
