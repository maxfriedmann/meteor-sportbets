var npeBot = getBotUser("[BOT] NullPointer");

npeBot.getBetFor = function(match)
{
	return {
		homegoals : 0,
		awaygoals : 0
	};
};

BetBots.push(npeBot);
