Meteor.methods({
	competitionsWithStatistics : function()
	{
		var competitions = Competitions.find({}, {
			sort : {
				orderId : -1
			}
		}).fetch();
		
		_.each(competitions, function(competition)
		{
			// total bets
			competition.totalBets = Bets.find({
				competitionId : competition._id
			}).count();
			
			// total players
			var playerArray = [];
			var totalPlayers = 0;
			Bets.find({
				"competitionId" : competition._id
			}).forEach(function(entry)
			{
				if (!_.contains(playerArray, entry.owner))
				{
					playerArray.push(entry.owner);
					totalPlayers++;
				}
			});
			competition.totalPlayers = totalPlayers;
			
			// matches count
			competition.totalMatches = Matches.find({
				"competitionId" : competition._id
			}).count();
			
			// finished matches count
			competition.totalFinishedMatches = Matches.find({
				"competitionId" : competition._id,
				"match_is_finished" : true
			}).count();
			
		});
		return competitions;
	}
});
