exports.command = function()
{
	this
	.click("#login-dropdown-list>a")
	.waitForElementVisible('#login-email', 10000)
	.setValue("#login-email", "test@test.com")
	.setValue("#login-password", "testtest")
	.click("#login-buttons-password")
	.waitForElementVisible('#login-dropdown-list>a',10000)
	.waitForElementPresent('.loggedInActions',10000)
	.assert.containsText('#login-dropdown-list>a', 'test@test.com');
	
	return this;
};
