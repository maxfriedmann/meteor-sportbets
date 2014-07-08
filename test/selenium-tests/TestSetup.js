module.exports = {
	createTestData : function(browser, client) {
		browser
		.url(browser.launch_url + "/test/setup")
		.waitForElementVisible('body', 10000)
		.waitForElementVisible('.alert.alert-success', 10000)
		.assert.containsText('#notifications','TEST_DATA_CREATED');
	},
	loginTestUser : function(browser) {
		browser
		.click("#login-dropdown-list>a")
		.waitForElementVisible('#login-email', 10000)
		.setValue("#login-email", "test@test.com")
		.setValue("#login-password", "testtest")
		.click("#login-buttons-password")
		.pause(2000)
		.assert.containsText('#login-dropdown-list>a', 'test@test.com');
	},
	testReportsDirectory : "tests-reports"
};

