var thomasBot = getBotUser("[BOT] Thomas Hertz");

thomasBot.getBetFor = function(match)
{
	// exception 1 : FC Bayern is playing away
	if (match.id_team2 == "40")
	{
		return {
			homegoals : 1,
			awaygoals : 2
		};
	}
	
	return {
		homegoals : 2,
		awaygoals : 1
	};
};

BetBots.push(thomasBot);
