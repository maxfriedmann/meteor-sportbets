Bets = new Meteor.Collection("bets", {
	transform : function(document)
	{
		return new Bet(document);
	}
});

if (Meteor.isServer)
{
	Meteor.publish("allBets", function()
	{
		return Bets.find({});
	});
	
	Meteor.publish("betsForCompetitionId", function(competitionId)
	{
		this.onStop(function()
		{
			console.log("unsubscribing from betsForCompetitionId : ", competitionId);
		});
		
		var bets = Bets.find({
			"competitionId" : competitionId,
			"match_is_finished" : true
		});
		console.log("subscribing to betsForCompetitionId : ", competitionId + " returning " + bets.count() + " records!");
		return bets;
	});
	
	Meteor.publish("betsForCompetitionIdAndPlayerId", function(competitionId, playerId)
	{
		this.onStop(function()
		{
			console.log("unsubscribing from betsForCompetitionIdAndPlayerId : ", competitionId, playerId);
		});
		
		var bets = Bets.find({
			"competitionId" : competitionId,
			"owner" : playerId
		});
		console.log("subscribing to betsForCompetitionIdAndPlayerId : ", competitionId, playerId, "returning " + bets.count() + " records!");
		return bets;
	});
	
	Meteor.publish("myBets", function(playerId)
	{
		var bets = Bets.find({
			"owner" : playerId
		});
		console.log("subscribing to myBets : ", playerId, "returning " + bets.count() + " records!");
		return bets;
	});
}
