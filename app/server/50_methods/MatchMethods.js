Meteor.methods({
	updateMatchManually: function (matchId, homegoalString, awaygoalString) {
		var match = Matches.findOne({
			"_id": matchId
		});

		var competition = Competitions.findOne(match.competitionId);

		if (isAdministrator() || this.userId === competition.owner) {
			check(matchId, String);
			check(homegoalString, String);
			check(awaygoalString, String);

			var homegoals = undefined;
			var awaygoals = undefined;

			try {
				homegoals = parseInt(homegoalString);
				awaygoals = parseInt(awaygoalString);
			} catch (e) {
				throw new Meteor.Error("Goals should be numbers!");
			}

			console.log("Manually Updating Match ID : " + matchId);



			if (match && matchId) {
				Matches.update(matchId, {
					$set: {
						"points_team1": homegoals,
						"points_team2": awaygoals,
						match_is_finished: true
					}
				}, function (error, success) {
					if (error) {
						throw new Meteor.Error(501, "Could not update Bet manually!", error);
					}

					// update points
					BetService.updatePointsForMatch(Matches.findOne({
						"_id": matchId
					}));

					// update ranking
					RankingService.updateRankings(match.competitionId);

					// update competition if needed
					CompetitionService.updateManualTournament(match.competitionId);
				});
			} else
				throw new Meteor.Error(501, "Could not find match with ID : " + matchId + "!");
		} else throw new Meteor.Error(403, "You're not the owner of this competition!");

	}
});