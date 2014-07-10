var request = require('request');
var TestSetup = require('./selenium-tests/globals/TestSetup.js');

module.exports = function(grunt)
{
	var tunnelId = process.env.TRAVIS_BUILD_ID == undefined ? "local" : process.env.TRAVIS_BUILD_ID;
	
	var saucelabsConfig = function(suites)
	{
		return {
			"standalone" : false,
			"src_folders" : suites,
			"launchUrl" : "http://localhost:3000",
			"selenium_host" : "localhost",
			"selenium_port" : "4445",
			"username" : "maxfriedmann",
			"access_key" : "9f608584-3969-4639-b95e-b4f3efbec2d9",
			"desiredCapabilities" : {
				"tunnel-identifier" : 'sportbets-' + tunnelId
			}
		};
	};
	
	grunt.initConfig({
		shell : {
			meteor_start : {
				command : 'meteor --settings settings.local.json',
				options : {
					async : true,
					execOptions : {
						cwd : '../app'
					},
					stdout : true,
					stderr : true,
					failOnError : false
				}
			}
		},
		mkdir : {
			all : {
				options : {
					mode : 0700,
					create : [ TestSetup.testReportsDirectory ]
				},
			},
		},
		sauce_tunnel : {
			options : {
				username : 'maxfriedmann',
				key : '9f608584-3969-4639-b95e-b4f3efbec2d9',
				identifier : 'sportbets-' + tunnelId,
				tunnelTimeout : 120
			},
			server : {}
		},
		sauce_tunnel_stop : {
			options : {
				username : 'maxfriedmann',
				key : '9f608584-3969-4639-b95e-b4f3efbec2d9',
				identifier : 'sportbets-' + tunnelId
			},
			server : {}
		},
		waitServer : {
			options : {
				url : 'http://localhost:3000',
				timeout : 600 * 1000
			}
		},
		nightwatch : {
			options : {
				standalone : true,
				settings : {
					"output_folder" : TestSetup.testReportsDirectory
				},
				test_settings : {
					"launchUrl" : "http://localhost:3000",
					"custom_commands_path" : "selenium-tests/commands",
					"globals_path" : "selenium-tests/globals"
				},
				"saucelabs_smoke" : saucelabsConfig([ "selenium-tests/tests/smoke" ]),
				"saucelabs_integration" : saucelabsConfig([ "selenium-tests/tests/integration" ]),
				"saucelabs_ui" : saucelabsConfig([ "selenium-tests/tests/ui" ]),
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-nightwatch');
	grunt.loadNpmTasks('grunt-shell-spawn');
	grunt.loadNpmTasks('grunt-sauce-tunnel');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-wait-server');
	
	grunt.registerTask('travis', [ 'mkdir:all', 'shell:meteor_start', 'waitServer', 'sauce_tunnel', 'nightwatch:saucelabs_smoke', 'nightwatch:saucelabs_integration', 'sauce_tunnel_stop' ]);
};
