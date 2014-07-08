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
					"username" : "maximilianfriedmann",
					"access_key" : "0a685284-2414-45ae-9187-74aafcab04ef"
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-nightwatch');
	grunt.loadNpmTasks('grunt-shell-spawn');
	grunt.loadNpmTasks('grunt-mkdir');
	
	grunt.registerTask('test', [ 'shell:meteor_start', 'nightwatch' ]);
	grunt.registerTask('sauce', [ 'mkdir:all', 'nightwatch:saucelabs' ]);
};
