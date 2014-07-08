module.exports = function(grunt)
{
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
					create : [ 'tests-reports' ]
				},
			},
		},
		sauce_tunnel: {
			options: {
				username: 'maxfriedmann',
				key: '9f608584-3969-4639-b95e-b4f3efbec2d9',
				identifier: 'sportbets',
				tunnelTimeout: 120 // whatever timeout you want to use
			},
			server: {}
		},
		sauce_tunnel_stop: {
		    	options: {
				username: 'maxfriedmann',
				key: '9f608584-3969-4639-b95e-b4f3efbec2d9',
				identifier: 'sportbets'
			},
			server: {}
		},
		
		nightwatch : {
			options : {
				standalone : true,
				settings : {
					"src_folders" : [ "selenium-tests/tests" ],
					"output_folder" : "tests-reports"
				},
				test_settings : {
					"launchUrl" : "http://localhost:3000"
				},
				live : {
					"launchUrl" : "http://sportbets-test.meteor.com"
				},
				"saucelabs" : {
					"standalone" : false,
					"launchUrl" : "http://localhost:3000",
					"selenium_host" : "ondemand.saucelabs.com",
					"selenium_port" : 80,
					"username" : "maxfriedmann",
					"access_key" : "9f608584-3969-4639-b95e-b4f3efbec2d9"
				},
				"saucelabs_connect" : {
					"standalone" : false,
					"launchUrl" : "http://localhost:3000",
					"selenium_host" : "localhost",
					"selenium_port" : "4445",
					"username" : "maxfriedmann",
					"access_key" : "9f608584-3969-4639-b95e-b4f3efbec2d9",
					"desiredCapabilities": {
						"tunnel-identifier" : "sportbets"
					  }
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-nightwatch');
	grunt.loadNpmTasks('grunt-shell-spawn');
	grunt.loadNpmTasks('grunt-sauce-tunnel');
	grunt.loadNpmTasks('grunt-mkdir');
	
	grunt.registerTask('test', [ 'shell:meteor_start', 'nightwatch' ]);
	grunt.registerTask('sauce', [ 'mkdir:all', 'nightwatch:saucelabs' ]);
	grunt.registerTask('travis', [ 'mkdir:all', 'shell:meteor_start', 'sauce_tunnel', 'nightwatch:saucelabs_connect','sauce_tunnel_stop' ]);
};
