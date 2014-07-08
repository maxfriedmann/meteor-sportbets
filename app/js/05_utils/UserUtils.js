loggedInCheck = function()
{
	if (Meteor.user() == null)
	{
		throw new Meteor.Error(403, "Not logged in!");
	}
};

verifiedUserCheck = function()
{
	loggedInCheck();
	
	if (Meteor.user().emails instanceof Array)
	{
		for (var i = 0; i < Meteor.user().emails.length; i++)
		{
			if (Meteor.user().emails[i].verified)
				return true;
		};
		
		throw new Meteor.Error(403, "E-Mail is not verified!", "notverified");
	}
	
	return true;
};

isAdministrator = function()
{
	return Meteor.user() != null && Meteor.user().administrator;
};
