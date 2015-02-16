// Mocha environment setup

var path = require('path');
var atomus = require('atomus');

var ROOT = path.join(__dirname, '../');
var SRC = path.join(ROOT, 'app');
var APP_MAIN = 'main';


/**
 * Make Chai’s expect available for all tests.
 */
global.expect = require('chai').expect;


/**
 * Creates jsdom browser, loads module via Require.js and register it as a global function.
 * Exposes jsdom’s browser as `global.browser`.
 *
 * @param {String} name Name of Require.js module: will be available as `global.module()`.
 * @param {Function} done
 */
global.requireModule = function(packages, names, done) {
	var requireJs = path.join(ROOT, 'bower_components/requirejs/require.js');

	var requireConfig = require(path.join(SRC, 'config.js'));
	requireConfig.baseUrl = SRC;
	requireConfig.paths.jquery = path.join(ROOT, 'node_modules/atomus/lib/vendor/jquery-1.11.1.min.js');
	requireConfig.deps.splice(requireConfig.deps.indexOf(APP_MAIN));  // Do not require whole app

	atomus()
		.html(
			'<!doctype html>' +
			'<script src="' + requireJs + '"></script>' +
			'<script>requirejs.config(' + JSON.stringify(requireConfig) + ')</script>'
		)
		.ready(function(errors, window) {
			global.browser = this;
			window.requirejs.onError = function(err) {
				console.log('Require.js can not require', err.requireModules);
				console.log(err.originalError.error);
				throw err;
			};
			window.requirejs(packages, function() {
				var functions = arguments;
				names.forEach(function(name, index) {
					global[name] = functions[index];
				});
				done(null);
			});
		});
};
