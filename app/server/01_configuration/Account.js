// enable mail verification
Accounts.config({
	sendVerificationEmail : true,
	forbidClientAccountCreation : false
});

// email template
Accounts.emailTemplates.siteName = "Sportbets";
Accounts.emailTemplates.from = "maximilian.friedmann@gmail.com";
Accounts.emailTemplates.resetPassword = {
	subject : function(user)
	{
		return "[Sportbets] Password Reset";
	},
	text : function(user, url)
	{
		var greeting = (user.profile && user.profile.name) ? ("Hello " + user.profile.name + ",") : "Hello,";
		return greeting + "\n" + "\n" + "To reset your password, simply click the link below.\n" + "\n" + url + "\n" + "\n" + "See ya.\n";
	}
};
Accounts.emailTemplates.verifyEmail = {
	subject : function(user)
	{
		return "[Sportbets] Verify your mail address";
	},
	text : function(user, url)
	{
		var greeting = (user.profile && user.profile.name) ? ("Hello " + user.profile.name + ",") : "Hello,";
		return greeting + "\n" + "\n" + "To verify your account email, simply click the link below.\n" + "\n" + url + "\n" + "\n" + "Many thanks.\n";
	}
};

// add default values to newly created users
Accounts.onCreateUser(function(options, user)
{
	if (options.profile)
	{
		if (user.services.facebook && user.services.facebook.id != null)
		{
			options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
		}
		user.profile = options.profile;
	}
	
	// username fixes
	if (!user.nickname)
	{
		// facebook user?
		if (user.profile && user.profile.name)
		{
			user.nickname = user.profile.name;
		}
		
		// last option is to use the mail address
		else if (user.emails && user.emails.length > 0)
		{
			user.nickname = user.emails[0].address;
		}
		else
			user.nickname = user._id;
	}
	
	// default avatar
	if (user.profile.picture == undefined)
	{
		user.profile.picture = "/images/avatars/contractor_128.png";
	}
	
	// verify immediately if hybris address
	
	// if (user.emails && user.emails instanceof Array && user.emails.length >
	// 0)
	// {
	// var mail = user.emails[0].address;
	// var suffix = "@hybris.com";
	// if (mail && mail.indexOf(suffix, mail.length - suffix.length) != -1)
	// {
	// user.emails[0].verified = true;
	// }
	// suffix = "@hybris.de";
	// if (mail && mail.indexOf(suffix, mail.length - suffix.length) != -1)
	// {
	// user.emails[0].verified = true;
	// }
	// }
	
	user.language = "en";
	user.administrator = false;
	
	return user;
});
