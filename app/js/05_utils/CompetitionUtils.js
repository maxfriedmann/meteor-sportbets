CompetitionUtils = {};

CompetitionUtils.getTournamentWildcardCount = function (playerCount) {

	var possibleTournamentCounts = [2, 4, 8, 16, 32, 64, 128, 256, 512];
	var tournamentSize = 2;

	for (var i = 0; i < possibleTournamentCounts.length; i++) {
		if (playerCount > possibleTournamentCounts[i]) tournamentSize = possibleTournamentCounts[(i + 1)];
	}

	return tournamentSize - playerCount;
};

CompetitionUtils.getTournamentRounds = function (playerCount) {
	playerCount += CompetitionUtils.getTournamentWildcardCount(playerCount);

	var plCount = 2;
	var rounds = 1;

	do {
		if (plCount === playerCount)
			return rounds;
		rounds++;
		plCount *= 2;
	}
	while (rounds < 25);

	throw new Meteor.Error("Could not determine tournament round count for player count " + playerCount);
}

CompetitionUtils.getTournamentRoundName = function (leagueDay, rounds) {

	var current = CompetitionUtils.getTournamentRoundMatchesCount(leagueDay, rounds);

	switch (current) {
	case 1:
		return "Finale";
	case 2:
		return "Halbfinale";
	case 4:
		return "Viertelfinale";
	case 8:
		return "Achtelfinale";
	case 16:
		return "Sechzehntelfinale";
	}

	throw new Meteor.Error("Could not determine tournament round name for day " + leagueDay + " and rounds " + rounds + ", current : " + current);
}

CompetitionUtils.getTournamentRoundMatchesCount = function (leagueDay, rounds) {

	var current = rounds - leagueDay;

	switch (current) {
	case 1:
		return 1;
	case 2:
		return 2;
	case 3:
		return 4;
	case 4:
		return 8;
	case 5:
		return 16;
	case 6:
		return 32;
	}

	throw new Meteor.Error("Could not determine tournament round count for day " + leagueDay + " and rounds " + rounds + ", current : " + current);
}