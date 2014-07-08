Meteor.methods({
	
	addNewCompetitionQuestion : function(competitionId, title, type, points, duedate)
	{
		check(competitionId, String);
		check(title, String);
		check(type, String);
		check(points, Number);
		check(duedate, Match.Where(function(date)
		{
			return date instanceof Date;
		}));
		if (isAdministrator())
		{
			var upsertResult = CompetitionQuestions.upsert({
				title : title,
				competitionId : competitionId
			}, {
				competitionId : competitionId,
				title : title,
				type : type,
				points : points,
				duedate : duedate
			});
			if (upsertResult.numberAffected == 1)
			{
				if (upsertResult.insertedId != null)
					return "New Competition Question insert!";
				else
					return "Competition Question updated!";
			}
			else
				throw new Meteor.Error(406, "Could not upsert competition question!");
		}
		else
			throw new Meteor.Error(403, "You're not an administrator!");
	}
});
