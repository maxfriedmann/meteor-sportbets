module.exports = {
	"Responsive Match Tests" : function(browser) {
		browser
		.url(browser.launch_url + "/competitions/testleague")
		.waitForElementVisible('body', 10000).resizeWindow(767, 1000)
		.saveScreenshot(browser.globals.testReportsDirectory + "/view_1_mobile.png")
		.resizeWindow(992, 1000)
		.saveScreenshot(browser.globals.testReportsDirectory + "/view_2_tablet.png")
		.resizeWindow(1200, 1000)
		.saveScreenshot(browser.globals.testReportsDirectory + "/view_3_desktop.png")
		.resizeWindow(1700, 1000)
		.saveScreenshot(browser.globals.testReportsDirectory + "/view_4_large.png")
		.end();
		
		console.log(browser.globals);
	}
};
