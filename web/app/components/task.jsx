define(function(require, exports, module) {
	'use strict';

	var React = require('react');

	/**
	 * @jsx React.DOM
	 */
	module.exports = React.createExtendedClass({
		getInitialState: function() {
			return {
				edit: this.get('new')
			};
		},

		toggleEditMode: function() {
			this.setState({edit: !this.state.edit});
		},

		save: function(event) {
			event.preventDefault();
			var values = this.getFormData(event.target);
			values.new = false;
			var model = this.model();
			model.set(values);
			model.save();
			this.toggleEditMode();
		},

		render: function() {
			if (this.state.edit) {
				return this.renderEdit();
			}
			else {
				return this.renderView();
			}
		},

		renderView: function() {
			return (
				<li>
					{this.get('name')}, {this.get('project')}, {this.get('client')}
					<button onClick={this.toggleEditMode}>Edit</button>
				</li>
			);
		},

		renderEdit: function() {
			return (
				<li>
					<form onSubmit={this.save}>
						<input type="text" defaultValue={this.get('name')} ref="name"/>
						<input type="text" defaultValue={this.get('project')} ref="project"/>
						<input type="text" defaultValue={this.get('client')} ref="client"/>
						<input type="submit" value="Save"/>
					</form>
				</li>
			);
		}
	});
});
