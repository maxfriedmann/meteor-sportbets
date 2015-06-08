Meteor.methods({
	doOLDBUpdateForCompetition: function (competitionId) {
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
		} else {
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
		if (this.userId === null)
			throw new Meteor.Error("You have to be logged in to be able to create a new competition!");
		if (!Match.test(id, String))
			throw new Meteor.Error("Competition ID must be a string!");
		if (!/^[a-zA-Z0-9_]+$/.test(id))
			throw new Meteor.Error("Competition ID shall only contain characters, numbers and underscores!");
		if (id.length < 3)
			throw new Meteor.Error("Competition ID must be at least 5 characters long!");

		if (!Match.test(name, String))
			throw new Meteor.Error("Competition Name must be a string!");
		if (name.length < 5)
			throw new Meteor.Error("Competition Name must be at least 5 characters long!");

		if (!Match.test(type, String))
			throw new Meteor.Error("Competition Type must be set!");
		if (!_.contains(CompetitionTypes, type))
			throw new Meteor.Error("Competition Type must be either openligadb, manualTournament or manualLeague!");



		if (Competitions.find({
				name: id
			}).count() !== 0)
			throw new Meteor.Error("This Competition ID is already used, please use another one!");


		// create the competition
		Competitions.insert({
			name: id,
			displayName: name,
			type: type,
			owner: this.userId
		});

		return true;
	},
	updateCompetition: function (id, name, options) {
		if (!Match.test(id, String))
			throw new Meteor.Error("Competition ID must be a string!");
		if (!Match.test(name, String))
			throw new Meteor.Error("Competition Name must be a string!");
		if (name.length < 5)
			throw new Meteor.Error("Competition Name must be at least 5 characters long!");

		check(options, Object);

		var competition = Competitions.findOne({
			_id: id
		});
		if (!competition)
			throw new Meteor.Error("Could not find competition with id : " + id);
		if (competition.owner !== this.userId)
			throw new Meteor.Error("You are not the owner of this competition!");

		// update the competition
		Competitions.update({
			_id: id
		}, {
			$set: {
				displayName: name,
				options: options
			}
		});

		return true;
	},
	startManualCompetition: function (id) {
		var competition = Competitions.findOne({
			_id: id
		});
		if (!competition)
			throw new Meteor.Error("Could not find competition with id : " + id);
		if (competition.owner !== this.userId)
			throw new Meteor.Error("You are not the owner of this competition!");

		// randomize teams?
		if (competition.options.randomizeTeamNames === true) {
			competition.options.teamNames = _.shuffle(competition.options.teamNames);
			// save 
			Competitions.update(competition.id, {
				$set: {
					"options.teamNames": competition.options.teamNames
				}
			});
		}

		// create matches
		if (competition.type === "manualLeague") {

			// take care of wildcard team
			if ((competition.options.teamCount % 2) !== 0)
				competition.options.teamCount++;

			var teams = _.range(0, competition.options.teamCount);
			var leagueDaysInTotal = teams.length - 1;

			console.log(teams);

			var leagueDays = [];

			for (var leagueDay = 0; leagueDay < leagueDaysInTotal; leagueDay++) {
				// create league days (competition groups)
				var leagueDayName = (leagueDay + 1) + ". Spieltag";
				Competitions.update(competition._id, {
					$push: {
						groups: {
							group_name: leagueDayName,
							group_id: leagueDay,
							group_order_id: leagueDay,
							multiplier: 1
						}
					}
				});

				leagueDays[leagueDay] = [];
				var teamsPlayed = [];

				for (var m = 0; m < (leagueDaysInTotal / 2); m++) {
					if (competition.options.randomizeTeamNames === true)
						teams = _.shuffle(teams);

					// get a free team
					var freeTeam = _.find(teams, function (index) {
						return !_.contains(teamsPlayed, index);
					});
					teamsPlayed.push(freeTeam);

					// get a free opponent that the team hasn't played against yet
					var freeOpponent = _.find(teams, function (index) {
						if (_.contains(teamsPlayed, index))
							return false;

						for (var i = 0; i < leagueDays.length; i++) {
							for (var j = 0; j < leagueDays[i].length; j++) {
								if ((leagueDays[i][j].home == index && leagueDays[i][j].away == freeTeam) || (leagueDays[i][j].home == freeTeam && leagueDays[i][j].away == index))
									return false;
							}
						}
						return true;
					});
					teamsPlayed.push(freeOpponent);

					// create the match        
					leagueDays[leagueDay].push({
						home: freeTeam,
						away: freeOpponent
					});
					Matches.insert({
						competitionId: competition._id,
						group_name: leagueDayName,
						group_order_id: leagueDay,
						group_id: leagueDay,
						name_team1: competition.options.teamNames[freeTeam],
						name_team2: competition.options.teamNames[freeOpponent],
						match_is_finished: false
					});
				}
			}
		} else if (competition.type === "manual1on1") {

			var teams = _.range(0, competition.options.teamCount);


			Competitions.update(competition._id, {
				$push: {
					groups: {
						group_name: "Hinrunde",
						group_id: 0,
						group_order_id: 0,
						multiplier: 1
					}
				}
			});
			if (competition.options.returnRound === true) {
				Competitions.update(competition._id, {
					$push: {
						groups: {
							group_name: "Rückrunde",
							group_id: 1,
							group_order_id: 1,
							multiplier: 1
						}
					}
				});
			}

			var orderIndex = 0;
			var teamCombosPlayedAlready = [];

			for (var teamA = 0; teamA < teams.length; teamA++) {
				for (var teamB = 0; teamB < teams.length; teamB++) {

					if (teamA === teamB || _.contains(teamCombosPlayedAlready, teamA + "_" + teamB))
						continue;


					// create the match        
					Matches.insert({
						competitionId: competition._id,
						group_name: "Hinrunde",
						group_order_id: 0,
						group_id: 0,
						orderId: orderIndex,
						name_team1: competition.options.teamNames[teamA],
						name_team2: competition.options.teamNames[teamB],
						match_is_finished: false
					});

					if (competition.options.returnRound === true) {
						Matches.insert({
							competitionId: competition._id,
							group_name: "Rückrunde",
							group_order_id: 1,
							group_id: 1,
							orderId: orderIndex,
							name_team1: competition.options.teamNames[teamB],
							name_team2: competition.options.teamNames[teamA],
							match_is_finished: false
						});
					}
					orderIndex++;
					teamCombosPlayedAlready.push(teamA + "_" + teamB);
					teamCombosPlayedAlready.push(teamB + "_" + teamA);
				}
			}
		} else if (competition.type === "manualTournament") {
			// take care of wildcard team
			if (CompetitionUtils.getTournamentWildcardCount(competition.options.teamCount) !== 0)
				competition.options.teamCount += CompetitionUtils.getTournamentWildcardCount(competition.options.teamCount);

			var teams = _.range(0, competition.options.teamCount);

			if (competition.options.randomizeTeamNames === true)
				teams = _.shuffle(teams);

			var leagueDaysInTotal = CompetitionUtils.getTournamentRounds(competition.options.teamCount);
			var currentRoundGamesCount = teams.length / 2;

			console.log(teams);

			for (var leagueDay = 0; leagueDay < leagueDaysInTotal; leagueDay++) {
				var leagueDayName = CompetitionUtils.getTournamentRoundName(leagueDay, leagueDaysInTotal);
				var orderId = 0;

				// create league days (competition groups)
				Competitions.update(competition._id, {
					$push: {
						groups: {
							group_name: leagueDayName,
							group_id: leagueDay,
							group_order_id: leagueDay,
							multiplier: 1
						}
					}
				});

				// special case for day one (all teams are playing)
				if (leagueDay === 0) {
					var teamsPlayed = [];
					for (var m = 0; m < currentRoundGamesCount; m++) {

						if (competition.options.randomizeTeamNames === true)
							teams = _.shuffle(teams);

						// get 2 free teams
						var teamA = _.find(teams, function (index) {
							return !_.contains(teamsPlayed, index);
						});
						teamsPlayed.push(teamA);
						var teamB = _.find(teams, function (index) {
							return !_.contains(teamsPlayed, index);
						});
						teamsPlayed.push(teamB);

						// create the match
						Matches.insert({
							competitionId: competition._id,
							group_name: leagueDayName,
							group_order_id: leagueDay,
							orderId: orderId++,
							group_id: leagueDay,
							name_team1: competition.options.teamNames[teamA],
							name_team2: competition.options.teamNames[teamB],
							match_is_finished: false
						});
					}
				}

				// other days can be prefilled with empty teams here (to be able to bet on them already and to see the tourmanemt tree)
				else {
					for (var i = 0; i < currentRoundGamesCount; i++) {
						// create the match
						Matches.insert({
							competitionId: competition._id,
							group_name: leagueDayName,
							group_order_id: leagueDay,
							group_id: leagueDay,
							orderId: orderId++,
							match_is_finished: false
						});
					}
				}

				currentRoundGamesCount /= 2;
			}
		}

		// start competition
		Competitions.update(competition.id, {
			$set: {
				"started": true
			}
		});
	},
	restartManualCompetition: function (id) {
		var competition = Competitions.findOne({
			_id: id
		});
		if (!competition)
			throw new Meteor.Error("Could not find competition with id : " + id);
		if (competition.owner !== this.userId)
			throw new Meteor.Error("You are not the owner of this competition!");

		// delete all matches and their bets
		Matches.find({
			competitionId: id
		}).forEach(function (match) {
			match.delete();
		});

		// set started flag and empty groups
		Competitions.update(id, {
			$set: {
				started: false,
				groups: []
			}
		});
	}
});