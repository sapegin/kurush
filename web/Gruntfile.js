// gruntjs.com
// jshint node:true
module.exports = function(grunt) {
	'use strict';

	require('tamia-grunt')(grunt, {
		tamia: {
			author: 'Artem Sapegin, http://sapegin.me',
			bower: false
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
};
