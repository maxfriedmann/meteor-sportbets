module.exports = {
	"PageIsUp" : function(browser) {
		browser.url(browser.launch_url)
		.waitForElementVisible('body', 60000)
		.waitForElementVisible('.sportbets-mainarea', 60000)
		.end();
	}
};
