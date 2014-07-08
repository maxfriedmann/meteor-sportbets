CompetitionQuestions = new Meteor.Collection("competitionQuestions", {
	transform : function(document)
	{
		return new CompetitionQuestion(document);
	}
});

if (Meteor.isServer)
{
	Meteor.publish("allCompetitionQuestions", function()
	{
		return CompetitionQuestions.find({});
	});
	
	Meteor.publish("competitionQuestionsByCompetitionId", function(competitionId)
	{
		return CompetitionQuestions.find({
			"competitionId" : competitionId
		});
	});
}
