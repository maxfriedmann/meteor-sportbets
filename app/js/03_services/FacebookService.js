FacebookService = {};

FacebookService.post = function(title, link, picture, caption, description)
{
	myFB.ui({
		method : 'feed',
		name : title,
		link : link,
		picture : picture,
		caption : caption,
		description : description
	}, function(response)
	{
		if (response && response.post_id)
		{
			alert('Post was published.');
		}
		else
		{
			alert('Post was not published.');
		}
	});
};

FacebookService.postOnFacebook = function(competition, match, bet)
{
	if (!Meteor.user().tutorials || !Meteor.user().tutorials.facebookSharing)
	{
		var fbTutorial = $modal.open({
			templateUrl : "/templates/info.html",
			controller : "InfoController",
			resolve : {
				"info" : function()
				{
					return {
						title : "Facebook Sharing Information",
						content : "If you share a bet on facebook it will get locked in Cuppy. This means after sharing you cannot edit your bet anymore!",
						ok : "Ok, got it!"
					};
				}
			}
		});
		
		fbTutorial.result.then(function(success)
		{
			Meteor.call("setTutorial", "facebookSharing", true);
			FacebookService._postOnFacebook(competition, match, bet);
		}, function()
		{
			// dismissed
		});
	}
	else
	{
		FacebookService._postOnFacebook(competition, match, bet);
	}
};

FacebookService._postOnFacebook = function(competition, match, bet)
{
	var caption = i18n("facebook.mybet") + " : " + bet.homegoals + " - " + bet.awaygoals;
	if (match.match_is_finished)
	{
		caption += ", " + i18n("facebook.result") + " " + match.points_team1 + " - " + match.points_team2;
	}
	
	FB.ui({
		method : 'feed',
		name : openligadbI18n(competition.name) + " : " + openligadbI18n(match.name_team1) + " vs. " + openligadbI18n(match.name_team2),
		link : 'http://cuppy.hybrislife.com',
		picture : 'http://cuppy.hybrislife.com/images/soccer.png',
		caption : caption,
		description : moment(match.match_date_time_utc).format('LLL')
	}, function(response)
	{
		if (response && response.post_id)
		{
			Bets.update({
				"_id" : bet._id
			}, {
				$set : {
					locked : true
				}
			});
		}
		else
		{
			// not shared
		}
	});
};
