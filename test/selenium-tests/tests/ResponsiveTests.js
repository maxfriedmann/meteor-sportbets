var TestSetup = require('../TestSetup');

module.exports = {
	setUp : function(browser) {
		TestSetup.createTestData(browser);
		TestSetup.loginTestUser(browser);
	},
	"Responsive Match Tests" : function(browser) {
		browser
		.url(browser.launch_url + "/competitions/testleague")
		.waitForElementVisible('body', 10000).resizeWindow(767, 1000)
		.saveScreenshot(TestSetup.testReportsDirectory + "/view_1_mobile.png")
		.resizeWindow(992, 1000)
		.saveScreenshot(TestSetup.testReportsDirectory + "/view_2_tablet.png")
		.resizeWindow(1200, 1000)
		.saveScreenshot(TestSetup.testReportsDirectory + "/view_3_desktop.png")
		.resizeWindow(1700, 1000)
		.saveScreenshot(TestSetup.testReportsDirectory + "/view_4_large.png")
		.end();
	}
};
