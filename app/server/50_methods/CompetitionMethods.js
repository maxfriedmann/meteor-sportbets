Meteor.methods({
	updateCompetition: function (competitionId) {
		if (isAdministrator()) {
			check(competitionId, String);
			console.log("Getting Competition by ID : " + competitionId);
			
			// clearing update flag
			Competitions.update({
				"_id": competitionId
			}, {
					$unset: {
						"openligadb.last_change_date": 1
					}
				});

			OpenLigaDBService.updateCompetition(competitionId);
			RankingService.updateRankings(competitionId);
		}
		else {
			throw new Meteor.Error(403, "You're not an administrator!");
		}
	},
	updatePoints: function (competitionId) {
		if (isAdministrator()) {
			check(competitionId, String);

			Matches.find({
				"competitionId": competitionId
			}).forEach(function (match) {
				BetService.updatePointsForMatch(match);
			});
		}
		return true;
	},
	createCompetition: function (id, name, type) {
		if (!Match.test(id, String))
			throw new Meteor.Error("Competition ID must be a string!");
		if (!Match.test(name, String))
			throw new Meteor.Error("Competition Name must be a string!");
		if (!Match.test(type, String))
			throw new Meteor.Error("Competition Type must be set!");
		if (!_.contains(["openligadb", "manualTournament", "manualLeague"], type))
			throw new Meteor.Error("Competition Type must be either openligadb, manualTournament or manualLeague!");
		if (name.length < 5)
			throw new Meteor.Error("Competition Name must be at least 5 characters long!");
		if (id.length < 3)
			throw new Meteor.Error("Competition ID must be at least 5 characters long!");
		if (Competitions.find({ name: id }).count() !== 0)
			throw new Meteor.Error("This Competition ID is already used, please use another one!");
		
			
		// create the competition
		Competitions.insert({ name: id, displayName: name, type: type, owner: this.userId });
		
		return true;
	}
});
