CompetitionService = {};

CompetitionService.updateManualTournament = function (competitionId) {
	var competition = Competitions.findOne(competitionId);
	if (competition === undefined)
		throw new Meteor.Error(404, "Could not find competition with ID : " + competitionId);

	if (competition.type === "manualTournament") {
		var winners = {};

		// fill winners
		Matches.find({
			competitionId: competitionId
		}, {
			sort: {
				group_order_id: 1,
				orderId: 1
			}
		}).forEach(function (match) {
			if (match.isFinished()) {
				if (winners[match.group_order_id] === undefined)
					winners[match.group_order_id] = {};

				if (match.points_team1 != match.points_team2) {
					var winner = match.points_team1 > match.points_team2 ? match.name_team1 : match.name_team2;
					winners[match.group_order_id][match.orderId] = winner;
				}
			}
		});

		for (var round = 0; round < CompetitionUtils.getTournamentRounds(competition.options.teamCount); round++) {
			// look if we can update the team names

			var winnersOfPreviousRound = winners[round];
			if (winnersOfPreviousRound !== undefined) {
				// set winners in matches
				for (var winnerIndex = 0, orderIndex = 0; winnerIndex < CompetitionUtils.getTournamentRoundMatchesCount(round, CompetitionUtils.getTournamentRounds(competition.options.teamCount)); winnerIndex++, orderIndex++) {
					var winnerA = winnersOfPreviousRound[winnerIndex];
					var winnerB = winnersOfPreviousRound[++winnerIndex];

					if (winnerA !== undefined) {
						console.log("winnerA : " + winnerA);
						Matches.update({
							competitionId: competitionId,
							group_order_id: (round + 1),
							orderId: orderIndex
						}, {
							$set: {
								name_team1: winnerA
							}
						});
					}

					if (winnerB !== undefined) {
						console.log("winnerB : " + winnerB);
						Matches.update({
							competitionId: competitionId,
							group_order_id: (round + 1),
							orderId: orderIndex
						}, {
							$set: {
								name_team2: winnerB
							}
						});
					}
					console.log("------------------------------------");
				}
			}
		}
	}
}