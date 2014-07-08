Meteor.startup(function()
{
	function leagueImport(id, openligadb)
	{
		if (Competitions.find({
			name : id
		}).count() === 0)
		{
			Competitions.insert({
				name : id,
				image : "/images/competitions/" + id + ".png",
				openligadb : openligadb
			});
			console.log("Successfully imported league : " + id);
		}
	}
	
	// World Cup 2014
	leagueImport("wc2014", {
		id : 676,
		shortcut : "WM-2014",
		saison : 2014
	});
	
	// // World Cup 2014 Friendlies Test
	// leagueImport("wc2014test", {
	// id : 733,
	// shortcut : "WM-2014-Freundschaftsspiele",
	// saison : 2014
	// });
	
	// EM 2012
	leagueImport("ec2012", {
		id : 429,
		shortcut : "em12",
		saison : 2012
	});
	
	// 1. Buli 2013
	leagueImport("buli2013", {
		id : 623,
		shortcut : "bl1",
		saison : 2013
	});
	
	// 1. Buli 2014
	leagueImport("buli2014", {
		id : 720,
		shortcut : "bl1",
		saison : 2014
	});
	
	// 2. Buli 2014
	leagueImport("2ndbuli2014", {
		id : 721,
		shortcut : "bl2",
		saison : 2014
	});
	
	// Champtions League 2013
	leagueImport("cl2013", {
		id : 651,
		shortcut : "cl",
		saison : 2013
	});
});
