Meteor.methods({
	getMails : function()
	{
		if (Meteor.userId() && isAdministrator())
		{
			var mails = [];
			Meteor.users.find({}).forEach(function(user)
			{
				var mailAddress = UserService.getMailAddress(user._id);
				if (mailAddress == null)
				{
					console.log("no mail address found for " + user._id);
				}
				else
					mails.push(mailAddress);
			});
			
			return mails;
		}
		else
			throw new Meteor.Error(403, "You're not an administrator!");
	},
	getDoubledMatches : function()
	{
		if (Meteor.userId() && isAdministrator())
		{
			var matches = [];
			Matches.find({}).forEach(function(match)
			{
				var count = Matches.find({
					"match_id" : match.match_id
				}).count();
				
				if (count > 1)
				{
					console.log("found one!");
					matches.push(match);
				}
			});
			
			return matches;
		}
	},
	getDoubledBets : function()
	{
		if (Meteor.userId() && isAdministrator())
		{
			var bets = [];
			Bets.find({}).forEach(function(bet)
			{
				var sameBets = Bets.find({
					"matchId" : bet.matchId,
					"owner" : bet.owner
				}, {
					sort : {
						points : -1
					}
				});
				
				var count = sameBets.count();
				
				if (count > 1)
				{
					bets.push(sameBets.fetch());
				}
			});
			
			return bets;
		}
	},
	fixDoubledBets : function()
	{
		if (Meteor.userId() && isAdministrator())
		{
			Bets.find({}).forEach(function(bet)
			{
				var sameBets = Bets.find({
					"matchId" : bet.matchId,
					"owner" : bet.owner
				}, {
					sort : {
						points : -1
					}
				});
				
				var count = sameBets.count();
				
				if (count > 1)
				{
					var theBets = sameBets.fetch();
					
					// keep bet with the most points (or just the first one)
					for (var i = 1; i < theBets.length; i++)
					{
						console.log("Deleting bet : ", theBets[i]._id);
						Bets.remove({
							_id : theBets[i]._id
						});
					}
				}
			});
			
			return true;
		}
	}
});
