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
