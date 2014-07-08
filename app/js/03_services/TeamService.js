TeamService = {};

TeamService.getAllTeams = function(withMapping)
{
	var allTeams = [];
	
	if (withMapping == undefined)
		withMapping = true;
	
	Matches.find({}).forEach(function(match)
	{
		var id1s = getTeamGroupingFor(match.id_team1);
		if (!_.contains(allTeams, id1s[0]))
		{
			allTeams.push(id1s[0]);
		}
		var id2s = getTeamGroupingFor(match.id_team2);
		if (!_.contains(allTeams, id2s[0]))
		{
			allTeams.push(id2s[0]);
		}
	});
	return allTeams;
};
