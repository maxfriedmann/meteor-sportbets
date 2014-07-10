module.exports = {
	"LocalisationTests" : function(browser) {
		browser
		.url(browser.launch_url + "/competitions")
		.waitForElementVisible('body', 60000)
		.waitForElementVisible('.sportbets-mainarea', 60000)
		.assert.containsText('.sportbets-mainarea', 'Look at these Awesome Competitions')
		.click("#navigationLanguageBtn")
		.click("#navigationGermanLanguageBtn")
		.assert.containsText('.sportbets-mainarea', 'Echt geile Wettbewerbe')
		.end();
	}
};
