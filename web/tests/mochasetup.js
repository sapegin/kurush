// Author: Artem Sapegin http://sapegin.me, 2015
// Mocha environment setup

/*jshint node:true*/
/*global localStorage:true, React:false, TestUtils:false*/
'use strict';

var path = require('path');
var jsdom = require('jsdom');
var localStorage = require('localStorage');

var ROOT = path.join(__dirname, '../');
var SRC = path.join(ROOT, 'app');
var APP_BOOTSTRAP = 'bootstrap';


/**
 * Make Chai’s expect available for all tests.
 */
global.expect = require('chai').expect;


/**
 * Patch Require.js config.
 */
var requireConfig = require(path.join(SRC, 'config.js'));
requireConfig.baseUrl = SRC;
requireConfig.deps = null;


/**
 * Creates jsdom browser, loads module via Require.js and register it as a global function.
 * Exposes jsdom’s browser as `global.browser`.
 *
 * @param {String} name Name of Require.js module: will be available as `global.module()`.
 * @param {Function} done
 */
global.requireModule = function(packages, done) {
	jsdom.env({
		html: '<!doctype html>',
		scripts: [path.join(ROOT, 'bower_components/requirejs/require.js')],
		features: {
			FetchExternalResources: ['script'],
			ProcessExternalResources: ['script']
		},
		created: function(errors, window) {
			jsdom.getVirtualConsole(window).sendTo(console);
			window.localStorage = localStorage;
		},
		done: function(errors, window) {
			if (errors) {
				console.log('Something went wrong in jsdom:', errors);
			}

			global.document = window.document;
			global.window = window;

			window.requirejs.onError = function(err) {
				if (err.requireModules) console.log('Require.js can not require', err.requireModules.toString());
				console.log(err.originalError ? err.originalError.error.toString() : err.toString());
			};
			window.requirejs.config(requireConfig);
			window.requirejs([APP_BOOTSTRAP], function() {
				var packageNames = Object.keys(packages);
				window.requirejs(packageNames, function() {
					var functions = arguments;
					packageNames.forEach(function(packageName, index) {
						global[packages[packageName]] = functions[index];
					});
					// done(null);
					setTimeout(done, 10);
				});
			});
		}
	});
};

/**
 * Renders React component into a detached DOM node.
 *
 * @param {ReactClass} cls Component to render.
 * @param {Object} props Component props.
 * @return {ReactComponent, HTMLElement} References to a rendered component and its DOM node.
 */
global.renderReactComponent = function(cls, props) {
	var component = React.createElement(cls, props);
	var element = TestUtils.renderIntoDocument(component);
	var node = element.getDOMNode();
	return [element, node];
};
