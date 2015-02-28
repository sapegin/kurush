// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var React = require('react');
	var Dispatcher = require('dispatcher');
	var Combobox = require('components/combobox');
	var Select = require('components/select');
	var ProjectsStore = require('stores/projects');

	/**
	 * @jsx React.DOM
	 */
	module.exports = React.createExtendedClass({
		displayName: 'Task',
		propTypes: {
			model: React.PropTypes.object.isRequired
		},

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
			values.state = +values.state;
			Dispatcher.actions.updateTask({
				model: this.model(),
				attributes: values
			});
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
			var model = this.model();
			var timeSpent = model.get('minutesSpent');

			return (
				<li>
					{this.get('name')}, {model.getProjectName()}, {model.getStateName()}, {model.get('summ')}, {model.get('rate')}, {timeSpent} hrs
					<button onClick={this.toggleEditMode} ref="edit">Edit</button>
				</li>
			);
		},

		renderEdit: function() {
			var model = this.model();
			var states = model.getSatesList();
			var projects = ProjectsStore.getNames();

			return (
				<li>
					<form onSubmit={this.save} ref="form">
						<div>
							<input type="text" defaultValue={model.get('name')} ref="name" name="name" placeholder="Title" tabIndex="1" autoFocus/>
							<Combobox items={projects} value={model.getProjectName()} ref="project" placeholder="Project" name="project" tabIndex="2"/>
							<Select items={states} value={model.get('state')} ref="state" name="state" tabIndex="3"/>
						</div>
						<div>
							<textarea defaultValue={model.get('notes')} ref="notes" placeholder="Notes" name="notes" tabIndex="4"/>
						</div>
						<div>
							<input type="submit" value="Save" tabIndex="5"/>
						</div>
					</form>
				</li>
			);
		}
	});
});
