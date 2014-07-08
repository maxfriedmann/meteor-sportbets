Matches = new Meteor.Collection("matches", {
	transform : function(document)
	{
		return new CompetitionMatch(document);
	}
});

if (Meteor.isServer)
{
	Meteor.publish("allMatches", function()
	{
		return Matches.find({});
	});
	
	Meteor.publish("matchesForCompetitionId", function(competitionId)
	{
		console.log("subscribing to matches from competition id : " + competitionId);
		var matches = Matches.find({
			"competitionId" : competitionId
		});
		console.log("returning " + matches.count() + " records!");
		return matches;
	});
}
