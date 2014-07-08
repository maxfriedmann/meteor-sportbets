Competitions = new Meteor.Collection("competitions", {
	transform : function(document)
	{
		return new Competition(document);
	}
});

Competitions.allow({
	update : function(userId, doc, fields, modifier)
	{
		return false;
	}
});

if (Meteor.isServer)
{
	Meteor.publish("allCompetitions", function()
	{
		return Competitions.find({});
	});
	
	Meteor.publish("competitionById", function(competitionId)
	{
		var competition = Competitions.find({
			_id : competitionId
		});
		console.log("subscribing to competition by id : " + competitionId + ", returning " + competition.count() + " records!");
		return competition;
	});
	
	Meteor.publish("competitionByName", function(competitionByName)
	{
		var competition = Competitions.find({
			name : competitionByName
		});
		console.log("subscribing to competition by name : " + competitionByName + ", returning " + competition.count() + " records!");
		return competition;
	});
}
