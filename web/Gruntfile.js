// gruntjs.com
// jshint node:true
module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: [
						'./tests/mochasetup',
						'coffee-script/register'
					]
				},
				src: [
					'tests/specs/*.coffee'
				]
			}
		},
	});

	grunt.registerTask('test', ['mochaTest']);
};
