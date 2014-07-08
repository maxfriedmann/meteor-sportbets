BetBots = [];

Bot = function(document)
{
	_.extend(this, document);
	this.id = document._id;
};

getBotUser = function(nickname)
{
	var bot = Meteor.users.findOne({
		"nickname" : nickname,
		"bot" : true
	});
	
	if (bot == undefined)
	{
		var id = Meteor.users.insert({
			"nickname" : nickname,
			"administrator" : false,
			"bot" : true,
			"profile" : {
				"picture" : "/images/avatars/bot.png"
			}
		});
		
		if (id)
		{
			return new Bot(Meteor.users.findOne({
				_id : id
			}));
		}
		else
		{
			console.log("Could not create new bot!");
			throw new Meteor.Error(404, "Could not create new bot!");
		}
	}
	else
		return new Bot(bot);
};
