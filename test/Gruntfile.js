var request = require('request');

module.exports = function(grunt)
{
	var tunnelId = process.env.TRAVIS_BUILD_ID == undefined ? "local" : process.env.TRAVIS_BUILD_ID;
	
	var TestSetup = grunt.file.readJSON('./globals/TestSetup.json');
	
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
					"custom_commands_path" : "frontend/commands",
					"src_folders" : [ "frontend/tests" ],
					"globals" : {
						"testReportsDirectory" : TestSetup.testReportsDirectory
					}
				},
				"integration" : {
					"src_folders" : [ "frontend/tests/integration" ]
				},
				"smoke" : {
					"src_folders" : [ "frontend/tests/smoke" ]
				},
				"ui" : {
					"src_folders" : [ "frontend/tests/ui" ]
				},
				"saucelabs_smoke" : saucelabsConfig([ "frontend/tests/smoke" ]),
				"saucelabs_integration" : saucelabsConfig([ "frontend/tests/integration" ]),
				"saucelabs_ui" : saucelabsConfig([ "frontend/tests/ui" ]),
			}
		},
		mochaTest : {
			test : {
				options : {
					reporter : 'spec'
				},
				src : [ 'unit/**/*.js' ]
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-nightwatch');
	grunt.loadNpmTasks('grunt-shell-spawn');
	grunt.loadNpmTasks('grunt-sauce-tunnel');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-wait-server');
	grunt.loadNpmTasks('grunt-mocha-test');
	
	grunt.registerTask('travis', [ 'mkdir:all', 'mochaTest', 'shell:meteor_start', 'waitServer', 'sauce_tunnel', 'nightwatch:saucelabs_smoke', 'nightwatch:saucelabs_integration', 'sauce_tunnel_stop' ]);
};
