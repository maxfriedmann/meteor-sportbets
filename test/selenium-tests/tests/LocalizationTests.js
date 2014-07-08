var TestSetup = require('../TestSetup');

module.exports = {
	"LocalisationTests" : function(browser) {
		browser.url(browser.launch_url + "/competitions")
		.waitForElementVisible('body', 10000)
		.assert.containsText('.sportbets-mainarea', 'Look at these Awesome Competitions')
		.click("#navigationLanguageBtn")
		.click("#navigationGermanLanguageBtn")
		.assert.containsText('.sportbets-mainarea', 'Echt geile Wettbewerbe')
		.saveScreenshot(TestSetup.testReportsDirectory + "/germanLanguage.png")
		.end();
	}
};
