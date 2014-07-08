// some words have to be translated back to english first
oI18n = [];
oI18n["Vorrunde"] = "competition.preliminaryround";
oI18n["Achtelfinale"] = "competition.last16";
oI18n["Achtefinale"] = "competition.last16";
oI18n["Viertelfinale"] = "competition.quarterfinals";
oI18n["Vorrunde"] = "competition.preliminaryround";
oI18n["Spiel um Platz 3"] = "competition.thirdplaceplayoff";
oI18n["Halbfinale"] = "competition.semifinals";
oI18n["Finale"] = "competition.final";

// TEAMS
oI18n["Algerien"] = "teams.algeria";
oI18n["Argentinien"] = "teams.argentina";
oI18n["Australien"] = "teams.australia";
oI18n["Belgien"] = "teams.belgium";
oI18n["Bosnien und Herzegowina"] = "teams.bosniaherzegovina";
oI18n["Brasilien"] = "teams.brazil";
oI18n["Chile"] = "teams.chile";
oI18n["Costa Rica"] = "teams.costarica";
oI18n["Deutschland"] = "teams.germany";
oI18n["Ecuador"] = "teams.ecuador";
oI18n["Elfenbeinküste"] = "teams.cotedivoire";
oI18n["England"] = "teams.england";
oI18n["Frankreich"] = "teams.france";
oI18n["Ghana"] = "teams.ghana";
oI18n["Griechenland"] = "teams.greece";
oI18n["Honduras"] = "teams.honduras";
oI18n["Iran"] = "teams.iran";
oI18n["Irland"] = "teams.irland";
oI18n["Italien"] = "teams.italy";
oI18n["Japan"] = "teams.japan";
oI18n["Kamerun"] = "teams.cameroon";
oI18n["Kolumbien"] = "teams.colombia";
oI18n["Kroatien"] = "teams.croatia";
oI18n["Mexiko"] = "teams.mexico";
oI18n["Netherlands"] = "teams.netherlands";
oI18n["Niederlande"] = "teams.netherlands";
oI18n["Nigeria"] = "teams.nigeria";
oI18n["Portugal"] = "teams.portugal";
oI18n["Russland"] = "teams.russia";
oI18n["Schweiz"] = "teams.switzerland";
oI18n["Spanien"] = "teams.spain";
oI18n["Serbien"] = "teams.serbia";
oI18n["Südkorea"] = "teams.southkorea";
oI18n["Österreich"] = "teams.austria";
oI18n["Tschechien"] = "teams.czech";
oI18n["Uruguay"] = "teams.uruguay";
oI18n["USA"] = "teams.usa";

openligadbI18n = function(id)
{
	// direct matches
	if (oI18n[id] != "" && oI18n[id] != undefined)
		return i18n(oI18n[id]);
	
	// matchday
	if (new RegExp("[0-9]{1,2}\. [a-zA-Z]*").test(id))
	{
		return id.replace("Spieltag", i18n("competition.matchday"));
	}
	
	// 2ndbundesliga
	if (new RegExp("2ndbuli[0-9]{4}").test(id))
	{
		return i18n("competition.names.2ndbundesliga") + " " + id.replace("2ndbuli", "");
	}
	
	// bundesliga
	if (new RegExp("buli[0-9]{4}").test(id))
	{
		return i18n("competition.names.bundesliga") + " " + id.replace("buli", "");
	}
	
	// world cup
	if (new RegExp("wc[0-9]{4}").test(id))
	{
		return i18n("competition.names.wc") + " " + id.replace("wc", "");
	}
	
	// european cup
	if (new RegExp("ec[0-9]{4}").test(id))
	{
		return i18n("competition.names.ec") + " " + id.replace("ec", "");
	}
	
	// european cup
	if (new RegExp("cl[0-9]{4}").test(id))
	{
		return i18n("competition.names.cl") + " " + id.replace("cl", "");
	}
	
	return i18n(id);
};
