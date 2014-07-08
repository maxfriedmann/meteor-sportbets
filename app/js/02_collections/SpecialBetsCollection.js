SpecialBets = new Meteor.Collection("specialbets", {
	transform : function(document)
	{
		return new SpecialBet(document);
	}
});

if (Meteor.isServer)
{
	Meteor.publish("allSpecialBets", function()
	{
		return SpecialBets.find({});
	});
	
	Meteor.publish("specialBetsForPlayerId", function(playerId)
	{
		return SpecialBets.find({
			"owner" : playerId
		});
	});
}
