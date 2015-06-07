Competition = function(document)
{
	_.extend(this, document);
	this.id = document._id;
};

/**
 * This method caches all bet groups after the first access
 */
Competition.prototype.getBetGroups = function()
{
	if (this.betGroups == undefined)
	{
		this.betGroups = BetGroups.find({
			competitionId : this.id
		}).fetch();
	}
	return this.betGroups;
};


Competition.prototype.isStarted = function () {
	if (this.started === undefined)
		throw new Meteor.Error("Competition does not have the started flag!");
	else
		return this.started === true;
};