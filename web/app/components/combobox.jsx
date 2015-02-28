// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var React = require('react');

	/**
	 * @jsx React.DOM
	 */
	module.exports = React.createExtendedClass({
		displayName: 'Combobox',
		propTypes: {
			items: React.PropTypes.array,
			value: React.PropTypes.string
		},

		getDefaultProps: function() {
			return {
				items: [],
				value: ''
			};
		},

		getValue: function() {
			return this.refs.input.getDOMNode().value;
		},

		render: function() {
			var listId = 'datalist_' + this._rootNodeID;
			var options = this.props.items.map(function(value) {
				return (
					<option key={value}>{value}</option>
				);
			});

			return (
				<div>
					<input defaultValue={this.props.value} list={listId} ref="input" {...this.getAttrs()}/>
					<datalist id={listId}>
						{options}
					</datalist>
				</div>
			);
		}
	});
});
