Meteor.methods({
	"newBetGroup" : function(name, description, prices, competitionId)
	{
		verifiedUserCheck();
		
		// check name
		if (!Match.test(name, String))
			throw new Meteor.Error(406, "Name should be given and a String!");
		name = name.trim();
		
		if (name.length < 3)
			throw new Meteor.Error(406, "Name should be a String with 3 or more characters!");
		
		if (!Match.test(description, String) || description.length <= 20)
			throw new Meteor.Error(406, "Please provide a meaningful description with 20 or more characters!");
		
		if (!Match.test(competitionId, String))
			throw new Meteor.Error(406, "Please provide a competition this bet group is based on!");
		
		if (prices == undefined)
			prices = "";
		
		check(prices, String);
		
		// get all with same name
		var betGroup = BetGroups.findOne({
			"name" : name,
			"competitionId" : competitionId
		});
		
		if (betGroup != undefined)
		{
			throw new Meteor.Error(403, i18n("betgroups.betgroupalreadyexists"));
		}
		
		BetGroups.insert({
			"owner" : this.userId,
			"name" : name,
			"competitionId" : competitionId,
			"description" : description,
			"prices" : prices
		}, function(error, id)
		{
			if (error)
			{
				throw new Meteor.Error(403, error);
			}
			
			console.log("_id", id);
			var group = BetGroups.findOne({
				"_id" : id
			});
			console.log("betgroup", group);
			if (group != undefined)
				return id;
			else
				throw new Meteor.Error(501, "Something went wrong while storing the bet group...");
		});
	},
	"joinBetGroup" : function(betGroupId)
	{
		check(betGroupId, String);
		
		// get group
		var betGroup = BetGroups.findOne({
			"_id" : betGroupId
		});
		
		if (betGroup == undefined)
		{
			throw new Meteor.Error(404, "Could not find group to join!");
		}
		
		// get mail addresses
		var currentUserMail = UserService.getMailAddress(this.userId);
		var currentUser = Meteor.users.findOne({
			_id : this.userId
		});
		var ownerMail = UserService.getMailAddress(betGroup.owner);
		var owner = Meteor.users.findOne({
			_id : betGroup.owner
		});
		
		// create text
		var url = Meteor.absoluteUrl("betgroups/" + betGroupId + "/addplayer/" + currentUser._id);
		var greeting = (owner.nickname) ? ("Hello " + owner.nickname + ",") : "Hello,";
		var theText = greeting + "\n" + "\n" + currentUser.nickname + " (" + currentUserMail + ") wants to join your Cuppy bet group '" + betGroup.name + "'. To accept the request, simply click the link below.\n" + "\n" + url + "\n" + "\n" + "See ya.\n";
		
		// send email
		Email.send({
			from : "cuppy@hybris.com",
			to : ownerMail,
			subject : "[Cuppy] " + currentUser.nickname + " wants to join '" + betGroup.name + "'",
			text : theText
		});
		
		return "The request was sent to the group's administrator. You will recieve a mail from Cuppy after the owner accepted your request!";
	},
	"addToBetGroup" : function(playerId, betGroupId)
	{
		if (!Match.test(playerId, String))
			throw new Meteor.Error(406, "Not a valid player id given!");
		if (!Match.test(betGroupId, String))
			throw new Meteor.Error(406, "Not a valid bet group id given!");
		
		console.log("Trying to add " + playerId + " to bet group " + betGroupId);
		
		// get group
		var betGroup = BetGroups.findOne({
			"_id" : betGroupId,
			"owner" : this.userId
		});
		
		if (betGroup == undefined)
		{
			throw new Meteor.Error(403, "You can't add players to this bet group!");
		}
		
		if (_.contains(betGroup.players, playerId))
		{
			return true;
		}
		
		// update bet group
		BetGroups.update({
			"_id" : betGroupId
		}, {
			$push : {
				players : playerId
			}
		});
		
		// send mail
		var player = Meteor.users.findOne({
			_id : playerId
		});
		var greeting = (player.nickname) ? ("Hello " + player.nickname + ",") : "Hello,";
		var theText = greeting + "\n" + "\nYou are now a proud member of the Cuppy bet group '" + betGroup.name + "'. \n" + "\n" + "See ya.\n";
		
		this.unblock();
		
		Email.send({
			from : "cuppy@hybris.com",
			to : UserService.getMailAddress(player._id),
			subject : "[Cuppy] " + betGroup.name + " Bet Group Join Request got accepted",
			text : theText
		});
		
		return true;
	}
});
