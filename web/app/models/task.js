// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var _ = require('underscore');
	var moment = require('moment');
	var Backbone = require('backbone');
	var Projects = require('collections/projects').getInstance();

	module.exports = Backbone.Model.extend({
		defaults: {
			name: '',
			project: null,
			state: 1,
			summ: null,
			rate: null,
			notes: '',
			minutesSpent: 0,
			created: null,
			updated: null,
			finished: null,
		},

		states: {
			1: 'New',
			2: 'Not started',
			3: 'In progress',
			4: 'Suspended',
			5: 'Unpaid',
			6: 'Closed'
		},

		initialize: function(attributes) {
			if (!attributes.created) {
				this.set('created', this.now());
			}
		},

		getProjectName: function() {
			var project = Projects.get(this.get('project'));
			return project && project.get('name');
		},

		getStateName: function() {
			return this.states[this.get('state')];
		},

		getStateIdByName: function(name) {
			return _.invert(this.states)[name];
		},

		getSatesList: function() {
			return this.states;
		},

		set: function(attributes, options) {
			// Skip set('field', value) calls, maybe support them later
			if (_.isObject(attributes)) {
				attributes.project = this.replaceValueWithId(attributes.project, Projects);

				// set({}, {update: true})
				if (options && options.update) {
					// Update time
					attributes.updated = this.now();

					// Task finished: moved to Unpaid or Closed
					var finishedStates = [this.getStateIdByName('Unpaid'), this.getStateIdByName('Closed')];
					if (attributes.state && _.include(finishedStates, attributes.state) && !_.include(finishedStates, this.get('state'))) {
						attributes.finished = this.now();
					}
				}
			}

			return Backbone.Model.prototype.set.call(this, attributes, options);
		},

		now: function() {
			return moment().unix();
		},

		replaceValueWithId: function(value, collection) {
			if (this.isRawValue(value)) {
				var project = collection.where({name: value})[0];
				if (!project) {
					project = collection.create({name: value});
				}
				return project.get('id');
			}
			return value;
		},

		isRawValue: function(value) {
			return !_.isEmpty(value) && !this.isUuid(value);
		},

		isUuid: function(string) {
			return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(string);
		}

	});

});
