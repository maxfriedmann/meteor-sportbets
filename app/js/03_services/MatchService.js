MatchService = {};

MatchService.getMatchesForTeam = function(teamId, withMapping, matchFinished, limit)
{
	if (withMapping == undefined)
		withMapping = true;
	
	if (limit == undefined)
		limit = 10000;
	
	var teamIds = [ teamId ];
	if (withMapping)
	{
		// try to find a mapping
		for (i in TeamGrouping)
		{
			if (_.contains(TeamGrouping[i], teamId))
			{
				teamIds = TeamGrouping[i];
			}
		};
	}
	
	if (matchFinished == undefined)
	{
		return Matches.find({
			$or : [ {
				"id_team1" : {
					$in : teamIds
				}
			}, {
				"id_team2" : {
					$in : teamIds
				}
			} ]
		}, {
			sort : {
				match_date_time_utc : 1
			},
			limit : limit
		
		});
	}
	else if (typeof matchFinished === 'boolean')
	{
		return Matches.find({
			$or : [ {
				"id_team1" : {
					$in : teamIds
				}
			}, {
				"id_team2" : {
					$in : teamIds
				}
			} ],
			"match_is_finished" : matchFinished
		}, {
			sort : {
				match_date_time_utc : 1
			},
			limit : limit
		
		});
		
	}
	else
		console.error("typeof matchFinished == " + (typeof matchFinished) + " is not possible!");
};
