CompetitionQuestion = function(document)
{
	_.extend(this, document);
	this.id = document._id;
};

CompetitionQuestion.prototype.isBetable = function()
{
	// date
	try
	{
		return this.duedate != undefined && new Date(Date.parse(this.duedate)).getTime() > new Date().getTime();
	}
	catch (ex)
	{
		console.error(ex);
	}
	
	return false;
};
