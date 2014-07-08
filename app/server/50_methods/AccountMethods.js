Meteor.methods({
	resendVerificationEmail : function()
	{
		if (Meteor.user())
		{
			Accounts.sendVerificationEmail(Meteor.userId());
			return "Verification Mail sent!";
		}
		else
		{
			throw new Meteor.Error(403, "Not logged in!");
		}
	},
	setLanguage : function(languageCode)
	{
		check(languageCode, String);
		
		Meteor.users.update({
			"_id" : this.userId
		}, {
			$set : {
				"language" : languageCode
			}
		});
	},
	updateProfile : function(nickname, profilePicture)
	{
		check(nickname, String);
		check(profilePicture, String);
		if (Meteor.user())
		{
			Meteor.users.update({
				"_id" : this.userId
			}, {
				$set : {
					"nickname" : nickname,
					"profile.picture" : profilePicture
				}
			});
		}
	},
	setTutorial : function(name, value)
	{
		check(name, String);
		check(value, Boolean);
		
		var user = Meteor.users.findOne(Meteor.user());
		
		var set = {
			tutorials : user.tutorials
		};
		if (set.tutorials == undefined)
			set.tutorials = {};
		set.tutorials[name] = value;
		
		Meteor.users.update({
			"_id" : this.userId
		}, {
			$set : set
		});
		
	}
});
