var updateAllBots = function()
{	
	Matches.find({}).forEach(function(match)
	{
		for (var b = 0; b < BetBots.length; b++)
		{
			var bet = BetBots[b].getBetFor(match);
			
			Bets.upsert({
				"matchId" : match.match_id,
				"owner" : BetBots[b]._id
			}, {
				"matchId" : match.match_id,
				"owner" : BetBots[b]._id,
				"homegoals" : bet.homegoals,
				"awaygoals" : bet.awaygoals,
				"competitionId" : match.competitionId,
				"points" : BetService.getPoints(bet, match)
			});
		};
	});
};

SyncedCron.add({
	name : 'Updating all matches from all bots',
	schedule : function(parser)
	{
		return parser.text('every 3rd hour');
	},
	job : function()
	{
		updateAllBots();
	}
});
