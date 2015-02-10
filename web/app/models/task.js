// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var _ = require('underscore');
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
			minutesSpent: 0
		},

		states: {
			1: 'New',
			2: 'Not started',
			3: 'In progress',
			4: 'Suspended',
			5: 'Unpaid',
			6: 'Closed'
		},

		getProjectName: function() {
			var project = Projects.get(this.get('project'));
			return project && project.get('name');
		},

		getStateName: function() {
			return this.states[this.get('state')];
		},

		getSatesList: function() {
			return this.states;
		},

		set: function(attributes, options) {
			attributes.project = this.replaceValueWithId(attributes.project, Projects);

			return Backbone.Model.prototype.set.call(this, attributes, options);
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
