Meteor.methods({
	saveSpecialBet : function(questionId, answer)
	{
		verifiedUserCheck();
		
		if (!Match.test(questionId, String))
		{
			throw new Meteor.Error(406, "QuestionID must be a String!");
		}
		if (!Match.test(answer, Match.Integer))
		{
			throw new Meteor.Error(406, "Answer must be given!");
		}
		
		// check if question exists
		var question = CompetitionQuestions.findOne({
			"_id" : questionId
		});
		if (question == undefined)
			throw new Meteor.Error(404, "Question not found!");
		
		// check due date
		if (!question.isBetable())
			throw new Meteor.Error(403, "This special bet cannot be changed anymore!");
		
		// upsert special bet
		var result = SpecialBets.upsert({
			owner : this.userId,
			questionId : questionId
		}, {
			owner : this.userId,
			questionId : questionId,
			answer : answer
		});
		
		if (result.numberAffected == 1)
		{
			if (result.insertedId != null)
				return "Your answer was saved successfully!";
			else
				return "Your answer was updated successfully!";
		}
		else
			throw new Meteor.Error(406, "Could not upsert your special bet answer!");
	},
	saveSpecialBetAnswer : function(questionId, answer)
	{
		if (isAdministrator())
		{
			if (!Match.test(questionId, String))
			{
				throw new Meteor.Error(406, "QuestionID must be a String!");
			}
			if (!Match.test(answer, Match.Integer))
			{
				throw new Meteor.Error(406, "Answer must be given!");
			}
			
			// set the answer
			CompetitionQuestions.update({
				"_id" : questionId
			}, {
				$set : {
					"answer" : answer
				}
			});
			
			var question = CompetitionQuestions.findOne({
				"_id" : questionId
			});
			
			console.log("question", question);
			console.log("Giving answer " + answer + " " + question.points + " points!");
			
			// add the points to the specialbets
			SpecialBets.update({
				"questionId" : questionId,
				"answer" : answer
			}, {
				$set : {
					"points" : question.points
				}
			}, {
				multi : true
			});
			
			SpecialBets.update({
				"questionId" : questionId,
				"answer" : {
					$ne : answer
				}
			}, {
				$set : {
					"points" : 0
				}
			}, {
				multi : true
			});
			
			// recalculate ranking
			RankingService.updateRankings(question.competitionId);
			
			return "Question successfully answered!";
		}
		else
			throw new Meteor.Error(403, "You're not an administrator!");
	}
});
