// gruntjs.com
// jshint node:true
module.exports = function(grunt) {
	'use strict';

	require('tamia-grunt')(grunt, {
		tamia: {
			author: 'Artem Sapegin, http://sapegin.me',
			bower: false
		},
		jshint: {
			options: {
				jshintrc: true
			},
			files: [
				'app/**/*.js',
				'!app/components/*.js'
			]
		},
		coffeelint: {
			options: {
				configFile: 'coffeelint.json'
			},
			tests: [
				'tests/specs/*.coffee'
			]
		},
		react: {
			views: {
				files: [
					{
						expand: true,
						cwd: 'app/components',
						src: ['**/*.jsx'],
						dest: 'app/components',
						ext: '.js'
					}
				]
			}
		},
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
		watch: {
			react: {
				options: {
					atBegin: true
				},
				files: 'app/components/*.jsx',
				tasks: ['react']
			}
		}
	});

	grunt.registerTask('default', ['styles']);
	grunt.registerTask('test', ['jshint', 'coffeelint', 'mochaTest']);
};
