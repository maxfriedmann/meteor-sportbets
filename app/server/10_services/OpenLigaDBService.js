OpenLigaDBService = {};

OpenLigaDBService.updateCompetition = function (competitionId) {

	var competition = Competitions.findOne({
		"_id": competitionId
	});

	// checking if openligadb data is available
	if (competition && competition.openligadb) {
		console.log("##########################################################");
		console.log("## Updating Competition : " + competition.name);
		console.log("##########################################################");

		// check for resultTypeId
		if (competition.openligadb.resultTypeId == undefined) {
			throw new Meteor.Error("To be able to update results via the OpenLigaDBService you have to provide a 'resultTypeId' in the OpenLigaDB configuration!");
		}

		try {
			// Check last change date from OpenLigaDB
			console.log("Checking last change date for id:" + competition.openligadb.id + ", saison:" + competition.openligadb.saison + ", shortcut:" +
				competition.openligadb.shortcut);
			var lastChangeDateResponse = HTTP.call("GET", "http://openligadb-json.heroku.com/api/last_change_date_by_league_saison ", {
				params: {
					"league_saison": competition.openligadb.saison,
					"league_shortcut": competition.openligadb.shortcut
				},
				timeout: 3000
			});
		} catch (e) {
			console.error(e);
			throw new Meteor.Error(e);
		}

		if (lastChangeDateResponse.statusCode != 200) {
			throw new Meteor.Error(lastChangeDateResponse.statusCode, "Error while getting lastChangeData from OpenLigaDB!");
		}

		// Compare last change date from OpenLigaDB with competition last
		// change date
		var openLigaDBDate = JSON.parse(lastChangeDateResponse.content);
		console.log("Last Change Date from OpenLigaDB : ", openLigaDBDate.last_change_date);
		if (competition.openligadb.last_change_date != undefined && competition.openligadb.last_change_date >= Date.parse(openLigaDBDate.last_change_date)) {
			console.log("Competition is up to date!");
			return true;
		}

		// updating groups
		console.log("Updating competition groups...");
		var availableGroupsResonse = HTTP.call("GET", "http://openligadb-json.heroku.com/api/avail_groups", {
			params: {
				"league_saison": competition.openligadb.saison,
				"league_shortcut": competition.openligadb.shortcut
			},
			timeout: 3000
		});

		if (availableGroupsResonse.statusCode != 200) {
			throw new Meteor.Error(availableGroupsResonse.statusCode, "Error while updating groups from OpenLigaDB!");
		}

		// fix single entry behaviour of OpenLigaDB
		if (!(availableGroupsResonse.data.group instanceof Array)) {
			var temp = availableGroupsResonse.data.group;
			availableGroupsResonse.data.group = [];
			availableGroupsResonse.data.group.push(temp);
		}

		// add group multipliers
		_.each(availableGroupsResonse.data.group, function (group) {
			if (group.group_name.toLowerCase().indexOf("finale") != -1 || group.group_name.toLowerCase().indexOf("spiel um platz 3") != -1) {
				group.multiplier = 2;
			} else {
				group.multiplier = 1;
			}
		});

		// save groups
		Competitions.update({
			"_id": competition._id
		}, {
			$set: {
				groups: availableGroupsResonse.data.group
			}
		});

		console.log("Competition Groups successfully updated, found " + availableGroupsResonse.data.group.length + " groups!");

		// update matches
		for (var g = 0; g < availableGroupsResonse.data.group.length; g++) {
			console.log("updating : " + availableGroupsResonse.data.group[g].group_name);

			var matchdataResponse = HTTP.call("GET", "http://openligadb-json.heroku.com/api/matchdata_by_group_league_saison", {
				params: {
					"groupOrderId": availableGroupsResonse.data.group[g].group_order_id,
					"league_saison": competition.openligadb.saison,
					"league_shortcut": competition.openligadb.shortcut
				},
				timeout: 10000
			});

			if (matchdataResponse.statusCode != 200) {
				throw new Meteor.Error(matchdataResponse.statusCode, "Error while updating matches for group '" + availableGroupsResonse.data.group[g].group_name + "' from OpenLigaDB!");
			}

			if (matchdataResponse && matchdataResponse.data.matchdata) {
				// fix single entry behaviour of OpenLigaDB
				if (!(matchdataResponse.data.matchdata instanceof Array)) {
					var temp = matchdataResponse.data.matchdata;
					matchdataResponse.data.matchdata = [];
					matchdataResponse.data.matchdata.push(temp);
				}

				for (var i = 0; i < matchdataResponse.data.matchdata.length; i++) {
					var match = matchdataResponse.data.matchdata[i];

					if (match.match_id > 0) {
						// check for results in result array
						if (match.match_results != undefined && match.match_results.match_result != undefined && match.match_results.match_result instanceof Array) {
							for (var r = 0; r < match.match_results.match_result.length; r++) {
								if (match.match_results.match_result[r].resultTypeId == competition.openligadb.resultTypeId) {
									match.points_team1 = match.match_results.match_result[r].points_team1;
									match.points_team2 = match.match_results.match_result[r].points_team2;
								}
							}
						}

						// check for results in result object
						if (match.match_results != undefined && match.match_results.match_result != undefined && match.match_results.match_result instanceof Object) {
							if (match.match_results.match_result.result_type_id == "3") {
								match.points_team1 = match.match_results.match_result.points_team1;
								match.points_team2 = match.match_results.match_result.points_team2;
							}
						}

						// convert goals to int again
						if (match.points_team1)
							match.points_team1 = parseInt(match.points_team1);
						if (match.points_team2)
							match.points_team2 = parseInt(match.points_team2);

						// update/insert matches
						Matches.upsert({
							"match_id": match.match_id,
							"competitionId": competition._id
						}, {
							$set: match
						});

						var updatedMatch = Matches.findOne({
							"match_id": match.match_id
						});

						// update bet points
						BetService.updatePointsForMatch(updatedMatch);
					} else {
						console.log("match id is negative", match.name_team2);
					}
				}
				console.log("Group '" + availableGroupsResonse.data.group[g].group_name + "' matchdata successfully updated!");
			} else {
				console.log("Could not update group, matchdataresult is : ", matchDataResult);
			}
		}

		if (openLigaDBDate != undefined) {
			Competitions.update({
				"_id": competition._id
			}, {
				$set: {
					"openligadb.last_change_date": Date.parse(openLigaDBDate.last_change_date)
				}
			});
		}

		// update rankings
		RankingService.updateRankings(competition._id);
	} else
		throw new Meteor.Error(406, "Not an openligadb competition! Aborting update...");

};