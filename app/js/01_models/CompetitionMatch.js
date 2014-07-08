CompetitionMatch = function(document)
{
	_.extend(this, document);
	this.id = document._id;
	
	// inject multiplier
	this.multiplier = 1;
	
	var competition = Competitions.findOne({
		"_id" : document.competitionId
	});
	
	if (competition && competition.groups instanceof Array)
	{
		for (var i = 0; i < competition.groups.length; i++)
		{
			if (competition.groups[i].group_id == this.group_id && competition.groups[i].multiplier != undefined)
			{
				this.multiplier = competition.groups[i].multiplier;
				break;
			}
		};
	}
};

CompetitionMatch.prototype.isBetable = function()
{
	// date
	try
	{
		var currentDate = new Date();
		if (currentDate.getTime() < new Date(Date.parse(this.match_date_time_utc)).getTime())
		{
			return true;
		}
	}
	catch (ex)
	{
		console.error(ex);
	}
	
	return false;
};

CompetitionMatch.prototype.getFlag = function(teamId, fallbackIconUrl)
{
	if (FlagMapping[teamId] != undefined)
		return FlagMapping[teamId];
	
	if (fallbackIconUrl)
		return fallbackIconUrl;
	else
	{
		console.log("no flag found for [id:" + this.id_team1 + "] " + this.name_team1);
		return undefined;
	}
};

CompetitionMatch.prototype.getHomeFlag = function()
{
	return this.getFlag(this.id_team1, this.icon_url_team1);
};

CompetitionMatch.prototype.getAwayFlag = function()
{
	return this.getFlag(this.id_team2, this.icon_url_team2);
};
