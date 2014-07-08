BetGroup = function(document)
{
	_.extend(this, document);
	this.id = document._id;
	
	if (this.players == undefined)
	{
		this.players = [];
	}
	
	this.players.push(this.owner);
};
