// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var _ = require('lodash');
	var Backbone = require('backbone');
	var Task = require('models/task');

	var Tasks = Backbone.Collection.extend({
		model: Task,
		localStorage: new Backbone.LocalStorage('Tasks'),

		initialize: function() {
			var statesOrder = [
				Task.STATE_IN_PROGRESS,
				Task.STATE_NOT_STARTED,
				Task.STATE_NEW,
				Task.STATE_SUSPENDED,
				Task.STATE_UNPAID,
				Task.STATE_CLOSED
			];
			var stateToOrder = {};
			_.each(statesOrder, function(state, order) {
				stateToOrder[state] = order;
			});
			this.stateToOrder = stateToOrder;
		},

		/**
		 * Order:
		 *   - has new attribute: always first
		 *   - is in progress, created
		 */
		comparator: function(a, b) {
			// New tasks always first
			if (a.get('new')) {
				return -1;
			}

			var aState = a.get('state');
			var bState = b.get('state');

			// Same state: newest first
			if (aState == bState) {
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

	// Singleton
	Tasks.getInstance = _.memoize(function() {
		return new Tasks();
	});

	module.exports = Tasks;
});
