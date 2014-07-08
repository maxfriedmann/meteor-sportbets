getTeamGroupingFor = function(teamId)
{
	for (i in TeamGrouping)
	{
		if (_.contains(TeamGrouping[i], teamId))
		{
			return TeamGrouping[i];
		}
	};
	
	return [ teamId ];
};

TeamGrouping = [];

// Germany
TeamGrouping.push([ "139", "725" ]);

// Ghana
TeamGrouping.push([ "111", "754" ]);
