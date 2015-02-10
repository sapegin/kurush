// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var React = require('react');
	var Task = require('components/task');

	/**
	 * @jsx React.DOM
	 */
	module.exports = React.createExtendedClass({
		render: function() {
			var tasks = this.collection().map(function(task) {
				return React.createElement(Task, {model: task, key: task.cid})
			});

			return (
				React.createElement("ul", null, 
					tasks
				)
			);
		}
	});
});
