var updateAllCompetitions = function()
{
	Competitions.find({}).forEach(function(competition)
	{
		try
		{
			OpenLigaDBService.updateCompetition(competition._id);
		}
		catch (ex)
		{
			console.log(ex);
		}
	});
	
};

if (Meteor.settings && Meteor.settings.developerMode)
{
	console.log("Developer Mode active, not enabling OLDB sync job!");
}
else
{
	SyncedCron.add({
		name : 'Updating all competitions and matches',
		schedule : function(parser)
		{
			return parser.text('every 10 minutes');
		},
		job : function()
		{
			updateAllCompetitions();
		}
	});
}
