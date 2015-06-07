Meteor.methods({
	placeDeltaBet : function(matchId, competitionId, deltaHomegoals, deltaAwaygoals)
	{
		if (Meteor.userId())
		{
			check(matchId, String);
			check(deltaHomegoals, Number);
			check(deltaAwaygoals, Number);
			check(competitionId, String);
			
			// check if goals are deltas
			if ((deltaHomegoals != 0 && deltaAwaygoals != 0) || (Math.abs(deltaHomegoals) + Math.abs(deltaAwaygoals) != 1))
			{
				throw new Meteor.Error(406, "A delta bet should only increase/decrease home or away goals by 1!");
			}
			
			verifiedUserCheck();
			
			console.log("placing bet on matchid : " + matchId);
			
			var match = Matches.findOne({
				"_id" : matchId
			});
			
			if (!match)
			{
				throw new Meteor.Error(404, i18n("errors.matchnotfound"));
			}
			
			if (!match.isBetable())
			{
				throw new Meteor.Error(403, i18n("errors.matchnotbetable"));
			}
			
			// get old bet to check locked state
			var oldBet = Bets.findOne({
				"owner" : this.userId,
				"matchId" : matchId
			});
			
			if (oldBet && oldBet.locked)
			{
				throw new Meteor.Error(403, "This bet is locked, you cannot change it anymore!");
			}
			
			if (oldBet && ((oldBet.homegoals + deltaHomegoals) < 0 || (oldBet.awaygoals + deltaAwaygoals) < 0))
			{
				// reset bet
				Bets.update({
					"owner" : this.userId,
					"matchId" : matchId
				}, {
					$set : {
						"homegoals" : 0,
						"awaygoals" : 0
					}
				});
				return "BET_NOW_ZERO";
			}
			
			if (oldBet)
			{
				var updatedBets = Bets.update({
					"owner" : this.userId,
					"matchId" : matchId
				}, {
					$inc : {
						"homegoals" : deltaHomegoals,
						"awaygoals" : deltaAwaygoals
					}
				}, function(error)
				{
					if (error != null)
					{
						throw new Meteor.Error(403, error);
					}
				});
				
				if (updatedBets == 0)
					throw new Meteor.Error(403, "Could not find your bet for updating!");
				else
				{
					return "SUCCESSFULLY_UPDATED_BET";
				}
			}
			else if (deltaHomegoals > 0 || deltaAwaygoals > 0)
			{
				var insertCount = Bets.insert({
					"owner" : this.userId,
					"matchId" : matchId,
					"leagueId" : parseInt(match.league_id),
					"homegoals" : 0,
					"awaygoals" : 0,
					"competitionId" : competitionId
				}, function(error)
				{
					if (error)
					{
						throw new Meteor.Error(403, error);
					}
				});
				if (insertCount == 0)
					throw new Meteor.Error(501, "Error occured while placing bet, could not insert bet!");
				else
					return "SUCCESSFULLY_INSERT_BET";
			}
			else
			{
				// just don't do anything, no old bet, no positive delta...
				return PlacingBetErrorCodes.NO_OLD_BET_NO_POSITIVE_DELTA;
			}
		}
		else
		{
			throw new Meteor.Error(403, i18n("account.notloggedin"));
		}
		
		return "REACHED_END";
	}
});
