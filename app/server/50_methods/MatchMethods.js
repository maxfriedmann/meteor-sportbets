Meteor.methods({
	updateMatchManually : function(matchId, homegoals, awaygoals)
	{
		if (isAdministrator())
		{
			check(matchId, String);
			check(homegoals, Number);
			check(awaygoals, Number);
			
			console.log("Manually Updating Match ID : " + matchId);
			
			var match = Matches.findOne({
				"match_id" : matchId
			});
			
			if (match && matchId)
			{
				Matches.update({
					"match_id" : matchId
				}, {
					$set : {
						"points_team1" : homegoals,
						"points_team2" : awaygoals,
						match_is_finished : true
					}
				}, function(error, success)
				{
					if (error)
					{
						throw new Meteor.Error(501, "Could not update Bet manually!", error);
					}
					
					// update points
					BetService.updatePointsForMatch(Matches.findOne({
						"match_id" : matchId
					}));
					
					// update ranking
					RankingService.updateRankings(match.competitionId);
				});
			}
			else
				throw new Meteor.Error(501, "Could not find match!", error);
		}
		return true;
	}
});