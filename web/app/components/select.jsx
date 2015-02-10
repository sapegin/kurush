// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var _ = require('underscore');
	var React = require('react');

	/**
	 * @jsx React.DOM
	 */
	module.exports = React.createExtendedClass({
		getDefaultProps: function() {
			return {
				items: {},
				value: ''
			};
		},

		getValue: function() {
			return this.refs.select.getDOMNode().value;
		},

		render: function() {
			var options = _.map(this.props.items, function(name, value) {
				return <option value={value} key={value}>{name}</option>
			});

			return (
				<select ref="select" defaultValue={this.props.value} {...this.getAttrs()}>
					{options}
				</select>
			);
		}
	});
});