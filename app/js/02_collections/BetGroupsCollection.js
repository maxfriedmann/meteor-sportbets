BetGroups = new Meteor.Collection("betgroups", {
	transform : function(document)
	{
		return new BetGroup(document);
	}
});

BetGroups.allow({
	insert : function(userId, doc)
	{
		return (userId && doc.owner === userId);
	},
	update : function(userId, doc, fields, modifier)
	{
		return doc.owner === userId;
	},
	remove : function(userId, doc)
	{
		return doc.owner === userId;
	}
});

if (Meteor.isServer)
{
	Meteor.publish("allBetGroups", function()
	{
		return BetGroups.find({}, {
			fields : {
				prices : 0
			}
		});
	});
	Meteor.publish("myBetGroups", function()
	{
		return BetGroups.find({
			$or : [ {
				"players" : this.userId
			}, {
				"owner" : this.userId
			} ]
		});
	});
	Meteor.publish("betGroupsForCompetitionId", function(competitionId)
	{
		return BetGroups.find({
			"competitionId" : competitionId
		}, {
			fields : {
				prices : 0
			}
		});
	});
	Meteor.publish("myBetGroupById", function(betGroupId)
	{
		return BetGroups.find({
			$or : [ {
				"players" : this.userId
			}, {
				"owner" : this.userId
			} ],
			"_id" : betGroupId
		});
	});
}
