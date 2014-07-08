var TestSetup = require('../TestSetup');

module.exports = {
	setUp : function(browser) {
		TestSetup.createTestData(browser);
		TestSetup.loginTestUser(browser);
	},
	"Placing Bets" : function(browser) {
		browser.url(browser.launch_url + "/competitions/testleague")
		.waitForElementVisible("body", 10000)
		.waitForElementVisible(".col-md-12.hidden-xs.matchdataRow",10000)
		.isVisible(".lock.icon.ng-scope")
		.isVisible(".unlock.icon.ng-scope")
		.isVisible(".arrow.up.icon.place-bet-button.ng-scope")
		.click(".arrow.up.icon.place-bet-button.ng-scope")
		.click(".arrow.up.icon.place-bet-button.ng-scope")
		.click(".arrow.up.icon.place-bet-button.ng-scope")
		.waitForElementVisible(".sportbets-betview-goals.sportbets-betview-goals-2",10000)
		.assert.elementNotPresent(".sportbets-betview-goals.sportbets-betview-goals-1")
		.end();
	}
};
