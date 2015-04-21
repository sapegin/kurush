// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var React = require('react');
	var Dispatcher = require('dispatcher');
	var ProjectsStore = require('stores/projects');
	var Combobox = require('components/combobox');
	var Select = require('components/select');

	module.exports = React.createExtendedClass({
		displayName: 'Task',
		propTypes: {
			model: React.PropTypes.object.isRequired
		},
		mixins: [
			React.AppStateMixin
		],

		isInEditMode: function() {
			return this.state.editingTaskId === this.get('id');
		},

		handleEdit: function(id) {
			Dispatcher.actions.setEditingTaskId({id: this.get('id')});
		},

		handleSave: function(event) {
			event.preventDefault();
			var values = this.getFormData(event.target);
			Dispatcher.actions.updateTask({
				model: this.model(),
				attributes: values
			});
			Dispatcher.actions.closeEditingTask();
		},

		render: function() {
			if (this.isInEditMode()) {
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
					<button onClick={this.handleEdit} ref="edit">Edit</button>
				</li>
			);
		},

		renderEdit: function() {
			var model = this.model();
			var states = model.getSatesList();
			var projects = ProjectsStore.getNames();

			return (
				<li>
					<form onSubmit={this.handleSave} ref="form">
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
