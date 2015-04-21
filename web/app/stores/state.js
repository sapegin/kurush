// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var Backbone = require('backbone');
	var Dispatcher = require('dispatcher');

	var StateModel = Backbone.Model.extend({
		localStorage: new Backbone.LocalStorage('State'),

		defaults: {
			editingTaskId: null
		},

		actions: {
			/**
			 * Opens given task in editor.
			 *
			 * @param {String} [params.id] Task ID.
			 */
			setEditingTaskId: function(params) {
				this.update({editingTaskId: params.id});
			},

			/**
			 * Closes task with opened editor.
			 */
			closeEditingTask: function() {
				this.update({editingTaskId: null});
			}
		},

		initialize: function() {
			this.dispatchToken = Dispatcher.registerActions(this.actions, this);
		},

		update: function() {
			this.set.apply(this, arguments);
			this.save();
		}
	});

	var StateStore = new StateModel({id: 1});

	module.exports = StateStore;
	module.exports.StateModel = StateModel;

});
