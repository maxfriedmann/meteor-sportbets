exports.command = function()
{
	this
	.url(this.launch_url + "/test/setup")
	.waitForElementVisible('body', 10000)
	.waitForElementVisible('.alert.alert-success', 10000)
	.assert.containsText('#notifications', 'TEST_DATA_CREATED');
	
	return this;
};
