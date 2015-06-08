CompetitionMatch = function (document) {
	_.extend(this, document);
	this.id = document._id;

	// inject multiplier
	this.multiplier = 1;

	var competition = Competitions.findOne({
		"_id": document.competitionId
	});

	if (competition && competition.groups instanceof Array) {
		for (var i = 0; i < competition.groups.length; i++) {
			if (competition.groups[i].group_id == this.group_id && competition.groups[i].multiplier != undefined) {
				this.multiplier = competition.groups[i].multiplier;
				break;
			}
		};
	}
};

CompetitionMatch.prototype.isBetable = function () {
	if (this.isFinished())
		return false;

	if (this.match_date_time_utc === undefined)
		return true;

	// date
	try {
		var currentDate = new Date();
		if (currentDate.getTime() < new Date(Date.parse(this.match_date_time_utc)).getTime()) {
			return true;
		}
	} catch (ex) {
		console.error(ex);
	}

	return false;
};

CompetitionMatch.prototype.isFinished = function () {
	return this.match_is_finished;
};

CompetitionMatch.prototype.getFlag = function (teamId, fallbackIconUrl) {
	if (FlagMapping[teamId] != undefined)
		return FlagMapping[teamId];

	if (fallbackIconUrl)
		return fallbackIconUrl;
	else {
		//console.log("no flag found for [id:" + this.id_team1 + "] " + this.name_team1);
		return undefined;
	}
};

CompetitionMatch.prototype.getHomeFlag = function () {
	return this.getFlag(this.id_team1, this.icon_url_team1);
};

CompetitionMatch.prototype.getAwayFlag = function () {
	return this.getFlag(this.id_team2, this.icon_url_team2);
};

CompetitionMatch.prototype.getBets = function () {
	return Bets.find({
		"matchId": this._id
	});
}


CompetitionMatch.prototype.getTeamNameA = function () {
	if (this.name_team1 !== null)
		return this.name_team1;
	return "n/a";
}

CompetitionMatch.prototype.getTeamNameB = function () {
	if (this.name_team2 !== null)
		return this.name_team2;
	return "n/a";
}

CompetitionMatch.prototype.delete = function () {
	// delete all bets
	Bets.remove({
		"matchId": this._id
	});
	
	// delete match
	Matches.remove(this._id);
}