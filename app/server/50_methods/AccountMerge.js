Meteor.methods({
	
	mergeItems : function(mergedUserId)
	{
		console.log('Merging DB items of user', mergedUserId, 'with user', Meteor.userId());
		
		try
		{
			// remove old bets from old account
			Bets.remove({
				"owner" : mergedUserId
			});
		}
		catch (e)
		{
			throw new Meteor.Error(500, e.toString());
		}
		
	},
	
	serviceStatus : function(serviceId)
	{
		check(serviceId, String);
		
		if (Meteor.user() == null)
			return false;
		
		var reti = Meteor.user().services && Meteor.user().services[serviceId] != undefined;
		
		return reti;
	}
});
