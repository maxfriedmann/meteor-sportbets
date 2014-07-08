if (Meteor.AppCache)
{
	
	if (Meteor.settings && Meteor.settings.appcache && Meteor.settings.appcache.disabled)
	{
		Meteor.AppCache.config({
			firefox : false,
			chrome : false
		});
	}
	else
	{
		Meteor.AppCache.config({
			firefox : true
		});
	}
	
}
