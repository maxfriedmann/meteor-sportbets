Meteor.methods({
	submitNews : function(type, text)
	{
		if (isAdministrator())
		{
			check(type, String);
			check(text, String);
			
			News.insert({
				"type" : type,
				"text" : text,
				"date" : new Date()
			});
			
			return true;
		}
		throw new Meteor.Error(401, "You're not an administrator!");
	}
});
