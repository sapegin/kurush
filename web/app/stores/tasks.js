// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var Backbone = require('backbone');
	var Dispatcher = require('dispatcher');
	var Task = require('models/task');

	var TasksCollection = Backbone.Collection.extend({
		model: Task,
		localStorage: new Backbone.LocalStorage('Tasks'),

		actions: {
			/**
			 * Create a task.
			 */
			createTask: function() {
				this.create({}, {at: 0});
			},

			/**
			 * Update given task.
			 *
			 * @param {Backbone.Model} params.model Task to update.
			 * @param {Object} params.attributes New values.
			 */
			updateTask: function(params) {
				var model = params.model;
				model.set(params.attributes, {update: true});
				model.save();
			}
		},

		initialize: function() {
			this.dispatchToken = Dispatcher.registerActions(this.actions, this);

			var statesOrder = [
				Task.STATE_IN_PROGRESS,
				Task.STATE_NOT_STARTED,
				Task.STATE_NEW,
				Task.STATE_SUSPENDED,
				Task.STATE_UNPAID,
				Task.STATE_CLOSED
			];
			var stateToOrder = {};
			statesOrder.forEach(function(state, order) {
				stateToOrder[state] = order;
			});
			this.stateToOrder = stateToOrder;
		},

		/**
		 * Order:
		 *   - has new attribute: always first
		 *   - is in progress, created, etc.
		 *   - by change date
		 */
		comparator: function(a, b) {
			var aState = a.get('state');
			var bState = b.get('state');

			// Same state: newest first
			if (aState === bState) {
				if (a.get('changed') > b.get('changed')) {
					return -1;
				}
				return 1;
			}

			// Sort by state
			if (this.stateToOrder[aState] < this.stateToOrder[bState]) {
				return -1;
			}

			return 1;
		}
	});

	var TasksStore = new TasksCollection();

	module.exports = TasksStore;
	module.exports.TasksCollection = TasksCollection;

});
